import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, parentId: user.parentId, companyName: user.companyName },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper para responder errores
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
};

// Middleware para emitir eventos de actualización (WebSockets) automáticamente
router.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const originalJson = res.json;
    res.json = function(body) {
      originalJson.call(this, body);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const io = req.app.get('io');
        if (io && req.user && req.user.ownerId) {
          io.to(req.user.ownerId).emit('updateData');
        }
      }
    };
  }
  next();
});

// --- CARDS ---
router.get('/cards', async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' }
    });
    const mappedCards = cards.map(c => ({
      ...c,
      bank: c.name,
      last4: c.lastFour,
      type: c.type.charAt(0) + c.type.slice(1).toLowerCase()
    }));
    res.json(mappedCards);
  } catch (error) { handleError(res, error); }
});

router.post('/cards', async (req, res) => {
  try {
    const { bank, type, currency, balance, last4, color } = req.body;
    const card = await prisma.card.create({
      data: {
        name: bank || 'Tarjeta',
        type: type ? type.toUpperCase() : 'DEBIT',
        currency: currency || 'USD',
        balance: balance || 0,
        lastFour: last4 || null,
        color: color || null,
        userId: req.user.ownerId
      }
    });
    res.json({
      ...card,
      bank: card.name,
      last4: card.lastFour,
      type: card.type.charAt(0) + card.type.slice(1).toLowerCase()
    });
  } catch (error) { handleError(res, error); }
});

router.put('/cards/:id', async (req, res) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: req.body
    });
    res.json(card);
  } catch (error) { handleError(res, error); }
});

router.delete('/cards/:id', async (req, res) => {
  try {
    // Delete movements first (due to Restrict constraint)
    await prisma.movement.deleteMany({
      where: { cardId: req.params.id, userId: req.user.ownerId }
    });
    await prisma.card.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

// --- MOVEMENTS ---
router.get('/movements', async (req, res) => {
  try {
    const movements = await prisma.movement.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { date: 'desc' },
      include: { card: true }
    });
    res.json(movements);
  } catch (error) { handleError(res, error); }
});

router.post('/movements', async (req, res) => {
  try {
    const { cardId, type, amount, description, date, category } = req.body;
    
    const movement = await prisma.movement.create({
      data: {
        type, amount, description, category, date: date ? new Date(date) : new Date(),
        cardId, userId: req.user.ownerId
      }
    });

    // Update card balance
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (card) {
      const newBalance = type === 'INCOME' 
        ? Number(card.balance) + Number(amount)
        : Number(card.balance) - Number(amount);
      await prisma.card.update({
        where: { id: cardId },
        data: { balance: newBalance }
      });
    }

    res.json(movement);
  } catch (error) { handleError(res, error); }
});

// --- CLIENTS ---
router.get('/clients', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) { handleError(res, error); }
});

router.post('/clients', async (req, res) => {
  try {
    const { name, email, phone, address, type } = req.body;
    const client = await prisma.client.create({
      data: {
        name: name || 'Unknown',
        email: email || null,
        phone: phone || null,
        address: address || null,
        type: type || 'client',
        userId: req.user.ownerId
      }
    });
    res.json(client);
  } catch (error) { handleError(res, error); }
});

router.put('/clients/:id', async (req, res) => {
  try {
    const client = await prisma.client.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: req.body
    });
    res.json(client);
  } catch (error) { handleError(res, error); }
});

router.delete('/clients/:id', async (req, res) => {
  try {
    await prisma.client.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

// --- BUDGETS ---
router.get('/budgets', async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(budgets);
  } catch (error) { handleError(res, error); }
});

router.post('/budgets', async (req, res) => {
  try {
    const { category, limit, period, color } = req.body;
    const budget = await prisma.budget.create({
      data: {
        category: category || 'General',
        limit: parseFloat(limit) || 0,
        period: period || 'monthly',
        color: color || null,
        userId: req.user.ownerId
      }
    });
    res.json({ ...budget, limit: Number(budget.limit), spent: Number(budget.spent) });
  } catch (error) { handleError(res, error); }
});

router.put('/budgets/:id', async (req, res) => {
  try {
    const budget = await prisma.budget.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: req.body
    });
    res.json(budget);
  } catch (error) { handleError(res, error); }
});

router.delete('/budgets/:id', async (req, res) => {
  try {
    await prisma.budget.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

// --- DOCUMENTS ---
router.get('/documents', async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(docs);
  } catch (error) { handleError(res, error); }
});

router.post('/documents', async (req, res) => {
  try {
    const { name, category, size, fileUrl, type, fileData } = req.body;
    let finalFileUrl = fileUrl || null;

    if (fileData) {
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], 'base64');
        const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadsDir, fileName);
        
        fs.writeFileSync(filePath, buffer);
        
        // Generate public URL
        const host = req.get('host');
        const protocol = host.includes('localhost') ? 'http' : 'https';
        finalFileUrl = `${protocol}://${host}/uploads/${fileName}`;
      }
    }

    const doc = await prisma.document.create({
      data: {
        name: name || 'Untitled',
        category: category || 'General',
        type: type || null,
        size: parseInt(size) || 0,
        fileUrl: finalFileUrl,
        userId: req.user.ownerId
      }
    });
    res.json(doc);
  } catch (error) { handleError(res, error); }
});

router.delete('/documents/:id', async (req, res) => {
  try {
    await prisma.document.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

// --- ACTIVITY LOGS ---
router.get('/activity', async (req, res) => {
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(logs);
  } catch (error) { handleError(res, error); }
});

router.post('/activity', async (req, res) => {
  try {
    const log = await prisma.activityLog.create({
      data: { ...req.body, userId: req.user.ownerId }
    });
    res.json(log);
  } catch (error) { handleError(res, error); }
});

// --- EXPECTED EXPENSES ---
router.get('/expected-expenses', async (req, res) => {
  try {
    const expenses = await prisma.expectedExpense.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { dueDate: 'asc' }
    });
    res.json(expenses);
  } catch (error) { handleError(res, error); }
});

router.post('/expected-expenses', async (req, res) => {
  try {
    const expense = await prisma.expectedExpense.create({
      data: { ...req.body, dueDate: new Date(req.body.dueDate), userId: req.user.ownerId }
    });
    res.json(expense);
  } catch (error) { handleError(res, error); }
});

router.delete('/expected-expenses/:id', async (req, res) => {
  try {
    await prisma.expectedExpense.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

router.put('/expected-expenses/:id/pay', async (req, res) => {
  try {
    const expense = await prisma.expectedExpense.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: { status: 'paid' }
    });
    res.json(expense);
  } catch (error) { handleError(res, error); }
});

// --- RECEIVABLES ---
router.get('/receivables', async (req, res) => {
  try {
    const items = await prisma.receivable.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { dueDate: 'asc' }
    });
    res.json(items);
  } catch (error) { handleError(res, error); }
});

router.post('/receivables', async (req, res) => {
  try {
    const { clientName, description, amount, dueDate, expectedDate } = req.body;
    const item = await prisma.receivable.create({
      data: {
        clientName: clientName || 'Unknown',
        description: description || '',
        amount: parseFloat(amount) || 0,
        dueDate: dueDate ? new Date(dueDate) : (expectedDate ? new Date(expectedDate) : new Date()),
        userId: req.user.ownerId
      }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

router.put('/receivables/:id/collect', async (req, res) => {
  try {
    const item = await prisma.receivable.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: { status: 'paid', paidDate: new Date(), cardId: req.body.cardId }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

// --- PAYABLES ---
router.get('/payables', async (req, res) => {
  try {
    const items = await prisma.payable.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { dueDate: 'asc' }
    });
    res.json(items);
  } catch (error) { handleError(res, error); }
});

router.post('/payables', async (req, res) => {
  try {
    const { providerName, description, amount, dueDate, expectedDate } = req.body;
    const item = await prisma.payable.create({
      data: {
        providerName: providerName || 'Unknown',
        description: description || '',
        amount: parseFloat(amount) || 0,
        dueDate: dueDate ? new Date(dueDate) : (expectedDate ? new Date(expectedDate) : new Date()),
        userId: req.user.ownerId
      }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

router.put('/payables/:id/pay', async (req, res) => {
  try {
    const item = await prisma.payable.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: { status: 'paid', paidDate: new Date(), cardId: req.body.cardId }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

// --- TEAM ---
router.get('/team', async (req, res) => {
  try {
    const isOwner = !req.user.parentId;
    const ownerId = req.user.ownerId;
    
    // Fetch owner details
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, name: true, email: true, companyName: true, companyLogo: true, teamCode: true }
    });

    // Fetch children
    const members = await prisma.user.findMany({
      where: { parentId: ownerId },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json({
      isOwner,
      companyName: owner.companyName,
      companyLogo: owner.companyLogo,
      teamCode: isOwner ? owner.teamCode : null,
      owner: { id: owner.id, name: owner.name, email: owner.email },
      members
    });
  } catch (error) { handleError(res, error); }
});

router.put('/team', async (req, res) => {
  try {
    if (req.user.parentId) {
      return res.status(403).json({ error: 'Solo el dueño puede actualizar la empresa.' });
    }
    const { companyName, companyLogo } = req.body;
    
    // Si no tiene teamCode, generar uno al crear la empresa por primera vez
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    const newTeamCode = currentUser.teamCode || Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        companyName,
        companyLogo: companyLogo !== undefined ? companyLogo : currentUser.companyLogo,
        teamCode: newTeamCode
      }
    });
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, companyName: user.companyName, companyLogo: user.companyLogo, teamCode: user.teamCode, token: generateToken(user), user: userWithoutPassword });
  } catch (error) { handleError(res, error); }
});

router.post('/team/members', async (req, res) => {
  try {
    if (req.user.parentId) {
      return res.status(403).json({ error: 'Solo el dueño puede crear miembros.' });
    }
    const { name, email, password } = req.body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email ya registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        parentId: req.user.id,
        role: 'USER'
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(member);
  } catch (error) { handleError(res, error); }
});

router.post('/team/join', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Si el usuario ya es dueño de un equipo o ya está en uno
    if (req.user.companyName) {
      return res.status(400).json({ error: 'Eres dueño de un equipo, no puedes unirte a otro.' });
    }
    
    const owner = await prisma.user.findUnique({ where: { teamCode: token } });
    if (!owner) {
      return res.status(400).json({ error: 'Código de equipo inválido.' });
    }

    // Join team
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { parentId: owner.id, role: 'USER' }
    });

    const { password: _p, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, token: generateToken(updatedUser), user: userWithoutPassword });
  } catch (error) { handleError(res, error); }
});

router.post('/team/leave', async (req, res) => {
  try {
    if (req.user.parentId) {
      // User is a member, just leave
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { parentId: null, role: 'USER' }
      });
      const { password: _p, ...userWithoutPassword } = updatedUser;
      return res.json({ success: true, message: 'Has abandonado el equipo', token: generateToken(updatedUser), user: userWithoutPassword });
    }

    // User is the OWNER
    if (!req.user.companyName) {
      return res.status(400).json({ error: 'No estás en un equipo.' });
    }

    const members = await prisma.user.findMany({ where: { parentId: req.user.id } });
    
    if (members.length === 0) {
      // Owner is alone, delete team info
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { companyName: null, companyLogo: null, teamCode: null }
      });
      const { password: _p, ...userWithoutPassword } = updatedUser;
      return res.json({ success: true, message: 'Equipo eliminado', token: generateToken(updatedUser), user: userWithoutPassword });
    }

    // Owner has members, transfer ownership
    const newOwner = members.find(m => m.role === 'ADMIN') || members[0];
    const ownerData = await prisma.user.findUnique({ where: { id: req.user.id } });

    // 1. Clear old owner FIRST to avoid teamCode unique constraint violation
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { companyName: null, companyLogo: null, teamCode: null, role: 'USER' }
    });

    // 2. Update other members to point to new owner
    await prisma.user.updateMany({
      where: { parentId: req.user.id, id: { not: newOwner.id } },
      data: { parentId: newOwner.id }
    });

    // 3. Promote new owner
    await prisma.user.update({
      where: { id: newOwner.id },
      data: {
        parentId: null,
        role: 'USER', // Changed from ADMIN to USER since we simplified roles
        companyName: ownerData.companyName,
        companyLogo: ownerData.companyLogo,
        teamCode: ownerData.teamCode
      }
    });

    // 4. Transfer business data
    const tables = ['card', 'movement', 'invoice', 'client', 'budget', 'document', 'activityLog', 'expectedExpense', 'receivable', 'payable', 'inventoryItem'];
    for (const table of tables) {
      await prisma[table].updateMany({
        where: { userId: req.user.id },
        data: { userId: newOwner.id }
      });
    }

    const { password: _p, ...userWithoutPassword } = updatedUser;
    res.json({ success: true, message: 'Has dejado el equipo y transferido la propiedad', token: generateToken(updatedUser), user: userWithoutPassword });
  } catch (error) { handleError(res, error); }
});

router.put('/team/members/:id', async (req, res) => {
  try {
    if (req.user.parentId) {
      return res.status(403).json({ error: 'Solo el dueño puede editar miembros.' });
    }
    const { role } = req.body;
    
    const member = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!member || member.parentId !== req.user.id) {
      return res.status(404).json({ error: 'Miembro no encontrado.' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });
    res.json(updated);
  } catch (error) { handleError(res, error); }
});

router.delete('/team/members/:id', async (req, res) => {
  try {
    if (req.user.parentId) {
      return res.status(403).json({ error: 'Solo el dueño puede eliminar miembros.' });
    }
    
    // Ensure the member belongs to this owner
    const member = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!member || member.parentId !== req.user.id) {
      return res.status(404).json({ error: 'Miembro no encontrado.' });
    }

    // Instead of deleting the user, we just kick them from the team
    await prisma.user.update({ 
      where: { id: req.params.id },
      data: { parentId: null }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

// --- INVENTORY ---
router.get('/inventory', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { userId: req.user.ownerId },
      orderBy: { createdAt: 'desc' },
      include: { provider: true }
    });
    res.json(items);
  } catch (error) { handleError(res, error); }
});

router.post('/inventory', async (req, res) => {
  try {
    const { name, containerType, capacity, unit, stock, minStock, providerId } = req.body;
    const item = await prisma.inventoryItem.create({
      data: {
        name,
        containerType,
        capacity: parseFloat(capacity) || 0,
        unit,
        stock: parseInt(stock) || 0,
        minStock: parseInt(minStock) || 0,
        providerId: providerId || null,
        userId: req.user.ownerId
      },
      include: { provider: true }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

router.put('/inventory/:id', async (req, res) => {
  try {
    const { name, containerType, capacity, unit, stock, minStock, providerId } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (containerType !== undefined) updateData.containerType = containerType;
    if (capacity !== undefined) updateData.capacity = parseFloat(capacity);
    if (unit !== undefined) updateData.unit = unit;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (minStock !== undefined) updateData.minStock = parseInt(minStock);
    if (providerId !== undefined) updateData.providerId = providerId || null;

    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id, userId: req.user.ownerId },
      data: updateData,
      include: { provider: true }
    });
    res.json(item);
  } catch (error) { handleError(res, error); }
});

router.delete('/inventory/:id', async (req, res) => {
  try {
    await prisma.inventoryItem.delete({
      where: { id: req.params.id, userId: req.user.ownerId }
    });
    res.json({ success: true });
  } catch (error) { handleError(res, error); }
});

export default router;
