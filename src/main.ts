



// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { CONFIG } from './app.constant';
// import * as bodyParser from 'body-parser';
// import { AppModule } from './app.module';
// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { UPLOADS_ROOT } from './upload.config';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     logger: ['log', 'error', 'warn', 'debug', 'verbose'],
//   });

//   // ✅ Configuration body-parser
//   // (n'affecte pas multipart/form-data : les uploads passent par Multer)
//   app.use(bodyParser.json({ limit: CONFIG().limit.postData }));
//   app.use(
//     bodyParser.urlencoded({ limit: CONFIG().limit.urlEncoded, extended: true }),
//   );

//   // ✅ CORS (une seule configuration)
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//     allowedHeaders: 'Content-Type, Accept, Authorization',
//   });

//   // ✅ Adapter WebSocket
//   app.useWebSocketAdapter(new IoAdapter(app));

//   // ✅ Fichiers statiques : MÊME dossier que celui où Multer écrit
//   // http://IP:4007/files/messages/xxx.jpg  ->  <projet>/uploads/messages/xxx.jpg
//   app.useStaticAssets(UPLOADS_ROOT, { prefix: '/files/' });

//   // ✅ Gestion des erreurs (sans arrêter le serveur pour une simple erreur)
//   process.on('unhandledRejection', (reason, promise) => {
//     console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
//   });

//   process.on('uncaughtException', (error) => {
//     console.error('❌ Uncaught Exception:', error);
//   });

//   const port = CONFIG().port || 4007;
//   // '0.0.0.0' : indispensable pour que le téléphone puisse joindre le PC
//   await app.listen(port, '0.0.0.0');

//   console.log('==========================================');
//   console.log(`🚀 Serveur HTTP démarré sur http://localhost:${port}`);
//   console.log(`🔌 WebSocket prêt sur ws://localhost:${port}`);
//   console.log(`📁 Fichiers servis depuis : ${UPLOADS_ROOT}`);
//   console.log(`📁 URL statique : http://localhost:${port}/files/`);
//   console.log('==========================================');
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CONFIG } from './app.constant';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UPLOADS_ROOT } from './upload.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // ✅ Configuration body-parser
  app.use(bodyParser.json({ limit: CONFIG().limit.postData }));
  app.use(
    bodyParser.urlencoded({ limit: CONFIG().limit.urlEncoded, extended: true }),
  );

  // ✅ CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // ✅ Adapter WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // ✅ Fichiers statiques : /files/... → <projet>/uploads/...
  // Cela sert : /files/messages/xxx.jpg ET /files/statuts/xxx.jpg
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/files/' });

  // ✅ Gestion des erreurs
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
  });

  const port = CONFIG().port || 4007;
  await app.listen(port, '0.0.0.0');

  console.log('==========================================');
  console.log(`🚀 Serveur HTTP démarré sur http://localhost:${port}`);
  console.log(`🔌 WebSocket prêt sur ws://localhost:${port}`);
  console.log(`📁 Fichiers servis depuis : ${UPLOADS_ROOT}`);
  console.log(`📁 URL statique : http://localhost:${port}/files/`);
  console.log(`📁 Statuts : http://localhost:${port}/files/statuts/`);
  console.log('==========================================');
}

bootstrap(); 