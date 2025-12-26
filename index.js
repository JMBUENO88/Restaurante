require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());
app.use(express.static('public'));

// --- RUTAS DE VISTAS ---
// Pantalla de Login (Raíz)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Pantalla del Dashboard (Solo se accede tras login)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// --- API (DATOS) ---

// 1. Crear Empresa
app.post('/api/empresas', async (req, res) => {
  const { data, error } = await supabase.from('empresas').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Creado", data });
});

// 2. Obtener todas las empresas (Para la lista de edición)
app.get('/api/empresas', async (req, res) => {
  const { data, error } = await supabase.from('empresas').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 3. Editar Empresa
app.put('/api/empresas/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('empresas').update(req.body).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Actualizado", data });
});

app.listen(port, () => {
  console.log(`\n--- PLATAFORMA RESTAURANTE ---`);
  console.log(`> Login: http://localhost:${port}`);
});