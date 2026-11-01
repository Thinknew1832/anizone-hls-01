'use client';

import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';

interface PlayerProps {
  url: string;
  poster?: string;
}

export default function AnimePlayer({ url, poster }: PlayerProps) {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!artRef.current) return;

    const art = new Artplayer({
      container: artRef.current,
      url: url,
      type: 'm3u8',
      poster: poster || '',
      volume: 0.8,
      isLive: false,
      autoplay: false,
      pip: true,
      autoSize: false,
      autoMini: false,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: false,
      miniProgressBar: true,
      playsInline: true,
      customType: {
        m3u8: function (video: HTMLVideoElement, url: string, art: Artplayer) {
          if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Unsupported playback format: m3u8';
          }
        },
      },
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [url, poster]);

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
      <div ref={artRef} className="w-full h-full" />
    </div>
  );
}
