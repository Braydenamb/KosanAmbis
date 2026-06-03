// ─── HIGH-RESOLUTION PRINT POSTER EXPORTER SYSTEM ───

export const exportHeatmapPoster = ({ yearData, layout, visualMode, seasonFilter, calculateCompositeColor, toRgbaStr }) => {
  const exportWidth = 2400;
  const exportHeight = 3200;
  const eCanvas = document.createElement('canvas');
  eCanvas.width = exportWidth;
  eCanvas.height = exportHeight;
  const eCtx = eCanvas.getContext('2d');
  if (!eCtx) return;

  eCtx.imageSmoothingEnabled = true;
  eCtx.imageSmoothingQuality = 'high';

  eCtx.fillStyle = '#fafaf9';
  eCtx.fillRect(0, 0, exportWidth, exportHeight);

  eCtx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
  eCtx.lineWidth = 15;
  eCtx.strokeRect(60, 60, exportWidth - 120, exportHeight - 120);

  eCtx.fillStyle = '#0f172a';
  eCtx.font = 'black 110px "Fredoka", sans-serif';
  eCtx.textAlign = 'center';
  eCtx.fillText("A YEAR OF HUMAN EXPERIENCE", exportWidth / 2, 340);

  eCtx.font = 'semibold italic 45px "Quicksand", sans-serif';
  eCtx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  eCtx.fillText("Procedural Emotional Map & Generative Life Canvas", exportWidth / 2, 420);

  eCtx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
  eCtx.lineWidth = 3;
  eCtx.beginPath();
  eCtx.moveTo(350, 480);
  eCtx.lineTo(exportWidth - 350, 480);
  eCtx.stroke();

  const coords = [];
  const count = yearData.length;

  if (layout === 'grid') {
    const cols = 53;
    const cellGap = 16;
    const gridW = cols * 32 + (cols - 1) * cellGap;
    const startX = (exportWidth - gridW) / 2;
    const startY = 850;

    for (let i = 0; i < count; i++) {
      const col = Math.floor(i / 7);
      const row = i % 7;
      const x = startX + col * (32 + cellGap) + 16;
      const y = startY + row * (32 + cellGap) + 16;
      coords.push({ index: i, x, y, size: 32 });
    }
  } else if (layout === 'radial') {
    const cx = exportWidth / 2;
    const cy = exportHeight / 2 - 100;
    const innerRadius = 120;
    const spiralGap = 4.0;
    const angleSpacing = 0.15;

    for (let i = 0; i < count; i++) {
      const angle = i * angleSpacing;
      const radius = innerRadius + i * spiralGap;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      coords.push({ index: i, x, y, size: 24 });
    }
  } else {
    const cellGap = 50;
    const gridW = count * cellGap;
    const startX = exportWidth / 2 - gridW / 2 + 100;
    const cy = exportHeight / 2 - 100;

    for (let i = 0; i < count; i++) {
      const x = startX + i * cellGap;
      const y = cy + Math.sin(i * 0.12) * 250 + Math.cos(i * 0.05) * 80;
      coords.push({ index: i, x, y, size: 28 });
    }
  }

  if (layout !== 'grid') {
    eCtx.beginPath();
    eCtx.lineWidth = 4;
    eCtx.strokeStyle = 'rgba(89, 158, 255, 0.22)';
    coords.forEach((coord, i) => {
      if (i === 0) eCtx.moveTo(coord.x, coord.y);
      else eCtx.lineTo(coord.x, coord.y);
    });
    eCtx.stroke();
  }

  coords.forEach((coord, i) => {
    const day = yearData[i];
    const color = calculateCompositeColor(day);

    eCtx.save();
    if (visualMode === 'liquid') {
      eCtx.fillStyle = toRgbaStr(color, 0.95);
      eCtx.shadowColor = toRgbaStr(color, 0.45);
      eCtx.shadowBlur = 15;

      eCtx.beginPath();
      if (layout === 'grid') {
        eCtx.roundRect(coord.x - coord.size / 2, coord.y - coord.size / 2, coord.size, coord.size, coord.size * 0.3);
      } else {
        eCtx.arc(coord.x, coord.y, coord.size / 2, 0, Math.PI * 2);
      }
      eCtx.fill();
    } else {
      eCtx.fillStyle = toRgbaStr(color, 1.0);
      eCtx.strokeStyle = '#0f172a';
      eCtx.lineWidth = 4.5;
      eCtx.shadowColor = '#0f172a';
      eCtx.shadowOffsetX = 6;
      eCtx.shadowOffsetY = 6;

      eCtx.beginPath();
      if (layout === 'grid') {
        eCtx.rect(coord.x - coord.size / 2, coord.y - coord.size / 2, coord.size, coord.size);
      } else {
        eCtx.arc(coord.x, coord.y, coord.size / 2, 0, Math.PI * 2);
      }
      eCtx.fill();
      eCtx.stroke();
    }
    eCtx.restore();
  });

  if (layout === 'grid') {
    eCtx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    eCtx.font = 'bold 24px "JetBrains Mono", monospace';
    eCtx.textAlign = 'center';
    
    const monthNames = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
    
    const cols = 53;
    const cellGap = 16;
    const gridW = cols * 32 + (cols - 1) * cellGap;
    const startX = (exportWidth - gridW) / 2;
    const gridTopY = 850;

    // Mathematically determine exact columns where months start to prevent drift and misalignment in high-res exports
    const monthPositions = [];
    const seenMonths = new Set();
    
    yearData.forEach((day, i) => {
      const parts = day.date.split('-');
      const monthIdx = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);
      
      if (i === 0 || dayNum === 1) {
        if (!seenMonths.has(monthIdx)) {
          seenMonths.add(monthIdx);
          const col = Math.floor(i / 7);
          monthPositions.push({
            name: monthNames[monthIdx],
            col: col
          });
        }
      }
    });

    monthPositions.forEach(pos => {
      const xPos = startX + pos.col * (32 + cellGap) + 16;
      eCtx.fillText(pos.name, xPos, gridTopY - 24);
    });
  }

  eCtx.save();
  eCtx.globalCompositeOperation = 'overlay';
  let grad = eCtx.createRadialGradient(exportWidth/2, exportHeight/2, 200, exportWidth/2, exportHeight/2, exportWidth);
  
  if (seasonFilter === 'spring') {
    grad.addColorStop(0, 'rgba(255, 224, 231, 0.08)');
    grad.addColorStop(1, 'rgba(254, 243, 199, 0.04)');
  } else if (seasonFilter === 'summer') {
    grad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
    grad.addColorStop(1, 'rgba(249, 115, 22, 0.03)');
  } else if (seasonFilter === 'autumn') {
    grad.addColorStop(0, 'rgba(217, 119, 6, 0.08)');
    grad.addColorStop(1, 'rgba(120, 53, 4, 0.05)');
  } else {
    grad.addColorStop(0, 'rgba(186, 230, 253, 0.07)');
    grad.addColorStop(1, 'rgba(30, 58, 138, 0.06)');
  }
  eCtx.fillStyle = grad;
  eCtx.fillRect(0, 0, exportWidth, exportHeight);
  eCtx.restore();

  eCtx.fillStyle = '#0f172a';
  eCtx.textAlign = 'left';
  eCtx.font = 'bold 36px "JetBrains Mono", monospace';
  
  eCtx.fillText("YEAR INTERVAL : 2025 - 2026", 180, exportHeight - 240);
  eCtx.fillText("ATMOSPHERE    : " + seasonFilter.toUpperCase() + " WAVE", 180, exportHeight - 180);
  eCtx.fillText("CANVAS STYLE  : " + visualMode.toUpperCase() + " ABSTRACT", 180, exportHeight - 120);

  eCtx.textAlign = 'right';
  eCtx.fillText("KOSANAMBIS ARTWORK LABS ©", exportWidth - 180, exportHeight - 240);
  eCtx.fillText("SIGNATURE: 0x98A1EF8", exportWidth - 180, exportHeight - 180);
  eCtx.fillText("DIGITAL VERIFICATION: AUTHENTIC", exportWidth - 180, exportHeight - 120);

  eCanvas.toBlob((blob) => {
    const link = document.createElement('a');
    link.download = `kosanambis-life-poster-${seasonFilter}-${layout}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }, 'image/png');
};
