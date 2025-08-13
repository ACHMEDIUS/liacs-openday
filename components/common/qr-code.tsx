'use client';

import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeProps {
  data: string;
  width?: number;
  height?: number;
  image?: string;
  dotsOptions?: {
    color?: string;
    type?: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
  };
  backgroundOptions?: {
    color?: string;
  };
  imageOptions?: {
    crossOrigin?: 'anonymous' | 'use-credentials';
    margin?: number;
    imageSize?: number;
    hideBackgroundDots?: boolean;
  };
  cornersSquareOptions?: {
    color?: string;
    type?: 'dot' | 'square' | 'extra-rounded';
  };
  cornersDotOptions?: {
    color?: string;
    type?: 'dot' | 'square';
  };
  onReady?: (qr: QRCodeStyling) => void;
}

export default function QRCode({
  data,
  width = 300,
  height = 300,
  image,
  dotsOptions = { color: '#000000', type: 'square' },
  backgroundOptions = { color: '#FFFFFF' },
  imageOptions = { crossOrigin: 'anonymous', margin: 0, imageSize: 0.3, hideBackgroundDots: true },
  cornersSquareOptions = { color: '#000000', type: 'square' },
  cornersDotOptions = { color: '#000000', type: 'dot' },
  onReady,
}: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width,
        height,
        type: 'svg',
        data,
        image,
        dotsOptions,
        backgroundOptions,
        imageOptions,
        cornersSquareOptions,
        cornersDotOptions,
      });
    }

    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }

    if (onReady && qrCode.current) {
      onReady(qrCode.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data,
        width,
        height,
        image,
        dotsOptions,
        backgroundOptions,
        imageOptions,
        cornersSquareOptions,
        cornersDotOptions,
      });
    }
  }, [
    data,
    width,
    height,
    image,
    dotsOptions,
    backgroundOptions,
    imageOptions,
    cornersSquareOptions,
    cornersDotOptions,
  ]);

  return <div ref={ref} />;
}
