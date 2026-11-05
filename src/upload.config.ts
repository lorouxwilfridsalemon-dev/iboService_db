// import { join, extname } from 'path';
// import { mkdirSync } from 'fs';
// import { diskStorage } from 'multer';
// import { BadRequestException } from '@nestjs/common';

// // ============================================================
// // 📁 UN SEUL ENDROIT pour les chemins d'upload
// // (utilisé à la fois par Multer pour ÉCRIRE et par main.ts pour SERVIR)
// // ============================================================
// export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
// export const UPLOADS_MESSAGES = join(UPLOADS_ROOT, 'messages');

// // Crée les dossiers s'ils n'existent pas
// mkdirSync(UPLOADS_MESSAGES, { recursive: true });

// // ============================================================
// // 📦 Limites et types autorisés
// // ============================================================
// export const TAILLE_MAX_FICHIER = 50 * 1024 * 1024; // 50 Mo (vidéos)

// export const TYPES_MESSAGE_AUTORISES = ['image', 'video', 'document'];

// const EXTENSIONS_INTERDITES = [
//   '.exe', '.bat', '.cmd', '.sh', '.msi', '.apk', '.js', '.php', '.jar',
// ];

// // ============================================================
// // 💾 Configuration Multer pour les fichiers de messagerie
// // ============================================================
// export const multerMessagesOptions = {
//   storage: diskStorage({
//     destination: (_req, _file, cb) => cb(null, UPLOADS_MESSAGES),
//     filename: (_req, file, cb) => {
//       const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
//     },
//   }),
//   limits: { fileSize: TAILLE_MAX_FICHIER },
//   fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
//     const ext = extname(file.originalname).toLowerCase();
//     if (EXTENSIONS_INTERDITES.includes(ext)) {
//       return cb(
//         new BadRequestException(`Type de fichier non autorisé (${ext})`),
//         false,
//       );
//     }
//     cb(null, true);
//   },
// };


// deep

import { join, extname } from 'path';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
 
// ============================================================
// 📁 UN SEUL ENDROIT pour les chemins d'upload
// (utilisé à la fois par Multer pour ÉCRIRE et par main.ts pour SERVIR)
// ============================================================
export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
export const UPLOADS_MESSAGES = join(UPLOADS_ROOT, 'messages');
export const UPLOADS_STATUTS = join(UPLOADS_ROOT, 'statuts');
 
// Crée les dossiers s'ils n'existent pas
mkdirSync(UPLOADS_MESSAGES, { recursive: true });
mkdirSync(UPLOADS_STATUTS, { recursive: true });
 
// ============================================================
// 📦 Limites et types autorisés
// ============================================================
export const TAILLE_MAX_FICHIER = 50 * 1024 * 1024; // 50 Mo (vidéos)
 
export const TYPES_MESSAGE_AUTORISES = ['image', 'video', 'document'];
export const TYPES_STATUTS_AUTORISES = ['image', 'video', 'texte'];
 
const EXTENSIONS_INTERDITES = [
  '.exe', '.bat', '.cmd', '.sh', '.msi', '.apk', '.js', '.php', '.jar',
];
 
const EXTENSIONS_IMAGES = [
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif',
];
const EXTENSIONS_VIDEOS = [
  '.mp4', '.mov', '.m4v', '.3gp', '.mkv', '.webm', '.avi',
];
 
// Extension de secours quand le nom d'origine n'en a pas
const EXTENSION_PAR_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/heic': '.heic',
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/3gpp': '.3gp',
  'video/webm': '.webm',
  'video/x-matroska': '.mkv',
};
 
function extensionDe(file: Express.Multer.File): string {
  const ext = extname(file.originalname || '').toLowerCase();
  if (ext) return ext;
  return EXTENSION_PAR_MIME[(file.mimetype || '').toLowerCase()] || '';
}
 
// ============================================================
// 💾 Configuration Multer pour les fichiers de messagerie
// ============================================================
export const multerMessagesOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_MESSAGES),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extensionDe(file)}`);
    },
  }),
  limits: { fileSize: TAILLE_MAX_FICHIER },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    const ext = extensionDe(file);
    if (EXTENSIONS_INTERDITES.includes(ext)) {
      return cb(
        new BadRequestException(`Type de fichier non autorisé (${ext})`),
        false,
      );
    }
    cb(null, true);
  },
};
 
// ============================================================
// 💾 Configuration Multer pour les statuts (stories)
// ============================================================
export const multerStatutsOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_STATUTS),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `statut-${unique}${extensionDe(file)}`);
    },
  }),
  limits: { fileSize: TAILLE_MAX_FICHIER },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    const ext = extensionDe(file);
    const mime = (file.mimetype || '').toLowerCase();
 
    // 🔍 Diagnostic : voir exactement ce que l'appli envoie
    console.log(
      `📥 [Statut] Fichier reçu — nom: ${file.originalname} | mime: ${mime} | ext: ${ext || '(aucune)'}`,
    );
 
    // ✅ On accepte selon le type MIME OU l'extension (certains téléphones
    // envoient "application/octet-stream" pour une photo ou une vidéo valide)
    const estMedia =
      mime.startsWith('image/') ||
      mime.startsWith('video/') ||
      EXTENSIONS_IMAGES.includes(ext) ||
      EXTENSIONS_VIDEOS.includes(ext);
 
    if (EXTENSIONS_INTERDITES.includes(ext) || !estMedia) {
      return cb(
        new BadRequestException(
          `Type de fichier non autorisé pour un statut (${ext || mime || 'inconnu'})`,
        ),
        false,
      );
    }
    cb(null, true);
  },
};

// import { join, extname } from 'path';
// import { mkdirSync } from 'fs';
// import { diskStorage } from 'multer';
// import { BadRequestException } from '@nestjs/common';

// // ============================================================
// // 📁 UN SEUL ENDROIT pour les chemins d'upload
// // (utilisé à la fois par Multer pour ÉCRIRE et par main.ts pour SERVIR)
// // ============================================================
// export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
// export const UPLOADS_MESSAGES = join(UPLOADS_ROOT, 'messages');
// // ✅ NOUVEAU : dossier des statuts (stories)
// export const UPLOADS_STATUTS = join(UPLOADS_ROOT, 'statuts');

// // Crée les dossiers s'ils n'existent pas
// mkdirSync(UPLOADS_MESSAGES, { recursive: true });
// mkdirSync(UPLOADS_STATUTS, { recursive: true }); // ✅ NOUVEAU

// // ============================================================
// // 📦 Limites et types autorisés
// // ============================================================
// export const TAILLE_MAX_FICHIER = 50 * 1024 * 1024; // 50 Mo (vidéos)

// export const TYPES_MESSAGE_AUTORISES = ['image', 'video', 'document'];
// // ✅ NOUVEAU : types de statuts autorisés
// export const TYPES_STATUTS_AUTORISES = ['image', 'video', 'texte'];

// const EXTENSIONS_INTERDITES = [
//   '.exe', '.bat', '.cmd', '.sh', '.msi', '.apk', '.js', '.php', '.jar',
// ];

// // ============================================================
// // 💾 Configuration Multer pour les fichiers de messagerie
// // ============================================================
// export const multerMessagesOptions = {
//   storage: diskStorage({
//     destination: (_req, _file, cb) => cb(null, UPLOADS_MESSAGES),
//     filename: (_req, file, cb) => {
//       const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
//     },
//   }),
//   limits: { fileSize: TAILLE_MAX_FICHIER },
//   fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
//     const ext = extname(file.originalname).toLowerCase();
//     if (EXTENSIONS_INTERDITES.includes(ext)) {
//       return cb(
//         new BadRequestException(`Type de fichier non autorisé (${ext})`),
//         false,
//       );
//     }
//     cb(null, true);
//   },
// };

// // ============================================================
// // ✅ NOUVEAU : Configuration Multer pour les statuts (stories)
// // ============================================================
// export const multerStatutsOptions = {
//   storage: diskStorage({
//     destination: (_req, _file, cb) => cb(null, UPLOADS_STATUTS),
//     filename: (_req, file, cb) => {
//       const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//       cb(null, `statut-${unique}${extname(file.originalname).toLowerCase()}`);
//     },
//   }),
//   limits: { fileSize: TAILLE_MAX_FICHIER },
//   fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
//     const ext = extname(file.originalname).toLowerCase();
//     const mime = file.mimetype;
//     // ✅ On accepte uniquement les images et vidéos pour les statuts
//     if (
//       EXTENSIONS_INTERDITES.includes(ext) ||
//       !(mime.startsWith('image/') || mime.startsWith('video/'))
//     ) {
//       return cb(
//         new BadRequestException(
//           `Type de fichier non autorisé pour un statut (${ext || mime})`,
//         ),
//         false,
//       );
//     }
//     cb(null, true);
//   },
// };