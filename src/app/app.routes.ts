import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/chat' },
  {
    path: 'chat',
    loadChildren: () =>
      import('../pages/chat.module').then(m => m.ChatModule),
  },
  {
    path: 'image-studio',
    loadChildren: () =>
      import('../pages/imageStudio/image.module').then(m => m.ImageModule),
  },
  {
    path: 'video-studio',
    loadChildren: () =>
      import('../pages/videoStudio/video.module').then(m => m.VideoModule),
  },
  {
    path: 'media-studio',
    loadChildren: () =>
      import('../pages/multi-media-center/media.module').then(m => m.MediaModule),
  },
];
