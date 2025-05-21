const express = require('express');
const jwt = require('jsonwebtoken');
const usuarios = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de Multer (guardar archivos en /uploads con su nombre original)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname); // para mantener la extensión original
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
   }
});

const upload = multer({ storage: storage });

// ===================== LOGIN =====================
usuarios.post("/login", async (req, res) => {
  const { Correo, Contraseña } = req.body;

  if (!Correo || !Contraseña) {
      return res.status(400).json({ code: 400, message: "Campos incompletos" });
  }
  const userQuery = `SELECT * FROM usuarios WHERE mail = ? AND password = ?`;
  const userRows = await db.query(userQuery, [Correo, Contraseña]);

  if (userRows.length === 1) {
      const token = jwt.sign({
          id_user: userRows[0].id_user,
          mail: userRows[0].mail,
          name: userRows[0].name,
          tipo: "usuario"
      }, "debugkey");

      return res.status(200).json({ code: 200, tipo: "usuario", message: token });
  }

  const adminQuery = `SELECT * FROM administracion WHERE mail = ? AND password = ?`;
  const adminRows = await db.query(adminQuery, [Correo, Contraseña]);

  if (adminRows.length === 1) {
      const token = jwt.sign({
          id_user: adminRows[0].id_user,
          mail: adminRows[0].mail,
          name: adminRows[0].name,
          tipo: "admin"
      }, "debugkey");

      return res.status(201).json({ code: 201, tipo: "admin", message: token });
  }

  return res.status(401).json({ code: 401, message: "Usuario o contraseña incorrectos" });
});

// ===================== REGISTRO =====================
usuarios.post("/signin", async (req, res) => {
    const { Nombre, Correo, Contraseña } = req.body;
    if (!Nombre || !Correo || !Contraseña) {
        return res.status(400).json({ code: 400, message: "Campos incompletos" });
    }

    const query1 = `SELECT * FROM usuarios WHERE mail = '${Correo}'`;
    const rows1 = await db.query(query1);
    if (rows1.length > 0) {
        return res.status(409).json({ code: 409, message: "Correo electrónico en uso" });
    }

    try {
        const query = "INSERT INTO usuarios (name, mail, password) VALUES (?, ?, ?)";
        const result = await db.query(query, [Nombre, Correo, Contraseña]);

        if (result.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "¡Registro exitoso!" });
        }
    } catch (error) {
        console.error("Error en /signin:", error.message);
        return res.status(500).json({ code: 500, message: "Error en el servidor", error: error.message });
    }
});

// ===================== SUBIR PUBLICACION =====================
usuarios.post('/subirpubli', auth, upload.array('imagenes', 10), async (req, res) => {
    const userId = req.userID;
    const archivos = req.files;

    const rutas = archivos.map(file => `/uploads/${file.filename}`);
    const rutasJson = JSON.stringify(rutas);

    const {
        PRO, ESTADO, MUN, HAB, BAN, EST, AMU, TAM, PRE, DES, Extras
    } = req.body;

    try {
        const sql = `
            INSERT INTO publicaciones (
                id_user, imagenes, PRO, ESTADO, MUN, HAB,
                BAN, EST, AMU, TAM, PRE, DES, Extras
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            userId, rutasJson, PRO, ESTADO, MUN, HAB,
            BAN, EST, AMU, TAM, PRE, DES, Extras
        ];

        await db.query(sql, values);

        res.status(201).json({ code: 201, message: "Publicación creada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Error al guardar publicación" });
    }
});

// ===================== SUBIR VALIDACION =====================
usuarios.post('/verificar', auth, upload.fields([
  { name: 'ine_photo', maxCount: 1 },
  { name: 'photo_user', maxCount: 1 }
]), async (req, res) => {
  const userId = req.userID;
  const { phone, mail, curp, rfc } = req.body;

  try {
      const ine_photo = `/uploads/${req.files['ine_photo'][0].filename}`;
      const photo_user = `/uploads/${req.files['photo_user'][0].filename}`;

      // Verificamos si ya existe
      const rows = await db.query('SELECT * FROM validaru WHERE id_user = ?', [userId]);
      console.log(rows);
      if (rows.length > 0) {
          // Ya existe, se actualiza
          const updateSql = `
              UPDATE validaru 
              SET phone = ?, mail2 = ?, ine_photo = ?, curp = ?, rfc = ?, photo_user = ?, status = 'En revisión'
              WHERE id_user = ?
          `;
          const updateValues = [phone, mail, ine_photo, curp, rfc, photo_user, userId];
          await db.query(updateSql, updateValues);
          res.status(200).json({ code: 200, message: "Verificación actualizada correctamente" });
      } else {
          // No existe, se inserta
          const insertSql = `
              INSERT INTO validaru (
                  id_user, phone, mail2, ine_photo, curp, rfc, photo_user
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          const insertValues = [userId, phone, mail, ine_photo, curp, rfc, photo_user];
          await db.query(insertSql, insertValues);
          res.status(201).json({ code: 201, message: "Verificación enviada correctamente" });
      }

  } catch (error) {
      console.error("Error al guardar/verificar datos:", error.message);
      res.status(500).json({ code: 500, message: "Error al guardar/verificar datos", error: error.message });
  }
});


// ===================== GET IMAGENES DE GALERIA =====================
usuarios.get("/getimg", auth, async (req, res) => {
    try {
        const query = `SELECT imagenes FROM imagenes WHERE id_user = ?`;
        const rows = await db.query(query, [req.userID]);

        if (rows.length > 0) {
            const imagenesJSON = JSON.parse(rows[0].imagenes);
            return res.status(200).json({ code: 200, imagenes: imagenesJSON });
        } else {
            return res.status(404).json({ code: 404, message: "Sin imágenes" });
        }
    } catch (error) {
        return res.status(500).json({ code: 500, message: "Error en el servidor", error: error.message });
    }
});

// ===================== Validaciones de admin =====================
usuarios.get('/validaciones', (req, res) => {
    const query = `
      SELECT 
        v.id_user,
        v.photo_user,
        v.ine_photo,
        v.mail2,
        v.phone,
        v.curp,
        v.rfc,
        v.status,
        u.name
      FROM validaru v
      JOIN usuarios u ON v.id_user = u.id_user
      ORDER BY FIELD(v.status, 'En revisión', 'Rechazado', 'Validado')
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener validaciones:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      res.json(results);
    });
  });


// ===================== Validacion True admin =====================
usuarios.post('/validar/:id', async (req, res) => {
    const idUser = req.params.id;
  
    try {
      // Actualizar estado en la tabla validaru
      const updateValidaruQuery = `
        UPDATE validaru 
        SET status = 'Validado'
        WHERE id_user = ?
      `;
      await db.query(updateValidaruQuery, [idUser]);
  
      // Actualizar user_validation en la tabla usuarios
      const updateUsuarioQuery = `
        UPDATE usuarios 
        SET user_validation = 'T'
        WHERE id_user = ?
      `;
      await db.query(updateUsuarioQuery, [idUser]);
  
      res.status(200).json({ message: "Usuario validado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al validar usuario" });
    }
  });
  
// ===================== Validacion rechazar admin =====================
usuarios.post('/rechazar/:id', async (req, res) => {
    const idUser = req.params.id;
  
    try {
      // Actualizar estado en la tabla validaru
      const updateValidaruQuery = `
        UPDATE validaru 
        SET status = 'Rechazado'
        WHERE id_user = ?
      `;
      await db.query(updateValidaruQuery, [idUser]);
      
      const updateUsuarioQuery = `
        UPDATE usuarios 
        SET user_validation = 'F'
        WHERE id_user = ?
      `;
      await db.query(updateUsuarioQuery, [idUser]);
  
      res.status(200).json({ message: "Usuario rechazado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al rechazar usuario" });
    }
  });
  
// ===================== GET PUBLICACIONES =====================
usuarios.get('/getpublicaciones', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*, 
        v.phone 
      FROM 
        publicaciones p
      INNER JOIN 
        validaru v 
      ON 
        p.id_user = v.id_user
    `;
    
    const resultados = await db.query(query);
    res.json(resultados);
    
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener las publicaciones' });
  }
});
// ===================== GET PUBLICACIONES USER ID =====================
usuarios.get('/getpublicaciones/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM publicaciones WHERE id_user = ?`;
    const resultados = await db.query(query, [id]);

    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener las publicaciones' });
  }
});

usuarios.get('/obtenerdatos/:id', async (req, res) => {
  const { id } = req.params;
  try {

      const [usuario] = await db.query('SELECT u.id_user, u.name, v.mail2, v.phone, v.photo_user FROM usuarios u JOIN validaru v ON u.id_user = v.id_user WHERE u.id_user = ?', [id]);
      if (usuario.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.log(usuario);
      res.json(usuario);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
});

usuarios.get('/getuser', auth, async (req, res) => {
  const userId = req.userID;
  try {
      const query = `
          SELECT u.name, u.id_user, v.photo_user, v.status, v.phone, v.mail2 
          FROM usuarios u 
          LEFT JOIN validaru v ON u.id_user = v.id_user 
          WHERE u.id_user = ?`;
      const rows = await db.query(query, [userId]);

      if (rows.length > 0) {
          return res.status(200).json(rows[0]);
      } else {
          return res.status(404).json({ code: 404, message: "Usuario no encontrado" });
      }
  } catch (error) {
      return res.status(500).json({ code: 500, message: "Error en el servidor", error: error.message });
  }
});
// ===================== ELIMINAR PUBLICACIÓN ID =====================
usuarios.delete('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const query = `DELETE FROM publicaciones WHERE id_publicacion = ?`;
      await db.query(query, id);
      res.status(200).json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
      console.error('Error al eliminar publicación:', error);
      res.status(500).json({ error: 'Error al eliminar la publicación' });
  }
});
// ===================== ACTUALIZAR PUBLICACIÓN ID =====================
usuarios.put('/actualizar/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { PRO, ESTADO, MUN, HAB, BAN, EST, AMU, TAM, PRE, DES, Extras } = req.body;

    try {
        const sql = `
            UPDATE publicaciones
            SET PRO = ?, ESTADO = ?, MUN = ?, HAB = ?, BAN = ?, EST = ?, AMU = ?, TAM = ?, PRE = ?, DES = ?, Extras = ?
            WHERE id_publicacion = ? AND id_user = ?
        `;

        const result = await db.query(sql, [
            PRO, ESTADO, MUN, HAB, BAN, EST, AMU, TAM, PRE, DES, Extras, id, req.userID
        ]);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: "Publicación actualizada correctamente" });
        } else {
            res.status(404).json({ message: "Publicación no encontrada o no autorizado para editar" });
        }
    } catch (error) {
        console.error("Error al actualizar publicación:", error);
        res.status(500).json({ message: "Error al actualizar la publicación" });
    }
});
module.exports = usuarios;
