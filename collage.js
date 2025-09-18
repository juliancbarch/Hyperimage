window.scrollTo(0, 0);
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  const images = Array.from(document.getElementsByClassName('collage-img'));

  // Shuffle images order
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    images[i].parentNode.insertBefore(images[j], images[i]);
  }

  const imgWidth = Math.min(window.innerWidth * 0.18, 350); // 18vw or max 350px
  const imgHeight = imgWidth * 0.7; // estimate aspect ratio
  const hGap = window.innerWidth * 0.10; // 10vw
  const vGap = window.innerHeight * 0.20; // 20vh (increased)
  const maxLeft = window.innerWidth - imgWidth - 10;
  const maxTop = window.innerHeight * 3 - imgHeight - 10; // increased vertical spread

  // Fixed image bounding box
  // Match CSS: position: fixed; top: 1vw; width: 56vw (max 800px)
  const fixedTop = window.innerWidth * 0.01; // 1vw from top
  const fixedLeft = window.innerWidth - Math.min(window.innerWidth * 0.56, 800) - window.innerWidth * 0.01; // 1vw from right
  const fixedWidth = Math.min(window.innerWidth * 0.56, 800);
  const fixedHeight = fixedWidth * 0.7;
  const fixedRight = fixedLeft + fixedWidth;
  const fixedBottom = fixedTop + fixedHeight;

  // B-series and color images zoom logic
  const bFiles = [
    '1B.jpg', '2B.jpg', '3B.jpg', '3S.jpg'
  ];
  const bImages = images.filter(img => bFiles.some(f => img.src.includes(f)));
  const colorImages = images.filter(img => isColor(img) && !bFiles.some(f => img.src.includes(f)));

  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 40000;
  overlay.style.transition = 'opacity 0.3s';
  overlay.style.opacity = 0;
  overlay.style.pointerEvents = 'none';
  overlay.style.visibility = 'hidden';

  const zoomImg = document.createElement('img');
  zoomImg.style.maxWidth = '92vw';
  zoomImg.style.maxHeight = '92vh';
  zoomImg.style.borderRadius = '0';
  zoomImg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.30)';
  zoomImg.style.background = '#fff';
  zoomImg.style.objectFit = 'contain';
  zoomImg.style.transition = 'box-shadow 0.2s';
  overlay.appendChild(zoomImg);

  // Navigation arrows
  const leftArrow = document.createElement('div');
  leftArrow.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="19" y1="4" x2="9" y2="14" stroke="white" stroke-width="3" stroke-linecap="round"/><line x1="9" y1="14" x2="19" y2="24" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>';
  leftArrow.style.position = 'absolute';
  leftArrow.style.left = 'calc(50% - 48vw)';
  leftArrow.style.top = '50%';
  leftArrow.style.transform = 'translateY(-50%)';
  leftArrow.style.fontSize = '2.2rem';
  leftArrow.style.color = 'rgba(255,255,255,0.87)';
  leftArrow.style.background = 'rgba(0,0,0,0.18)';
  leftArrow.style.borderRadius = '50%';
  leftArrow.style.width = '2.4rem';
  leftArrow.style.height = '2.4rem';
  leftArrow.style.display = 'flex';
  leftArrow.style.alignItems = 'center';
  leftArrow.style.justifyContent = 'center';
  leftArrow.style.cursor = 'pointer';
  leftArrow.style.userSelect = 'none';
  leftArrow.style.zIndex = 40001;
  leftArrow.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
  overlay.appendChild(leftArrow);

  const rightArrow = document.createElement('div');
  rightArrow.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="9" y1="4" x2="19" y2="14" stroke="white" stroke-width="3" stroke-linecap="round"/><line x1="19" y1="14" x2="9" y2="24" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>';
  rightArrow.style.position = 'absolute';
  rightArrow.style.right = 'calc(50% - 48vw)';
  rightArrow.style.top = '50%';
  rightArrow.style.transform = 'translateY(-50%)';
  rightArrow.style.fontSize = '2.2rem';
  rightArrow.style.color = 'rgba(255,255,255,0.87)';
  rightArrow.style.background = 'rgba(0,0,0,0.18)';
  rightArrow.style.borderRadius = '50%';
  rightArrow.style.width = '2.4rem';
  rightArrow.style.height = '2.4rem';
  rightArrow.style.display = 'flex';
  rightArrow.style.alignItems = 'center';
  rightArrow.style.justifyContent = 'center';
  rightArrow.style.cursor = 'pointer';
  rightArrow.style.userSelect = 'none';
  rightArrow.style.zIndex = 40001;
  rightArrow.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
  overlay.appendChild(rightArrow);

  document.body.appendChild(overlay);

  let currentZoomGroup = [];
  let currentZoomIndex = 0;
  function showZoom(idx, group) {
    currentZoomGroup = group;
    currentZoomIndex = idx;
    zoomImg.src = group[idx].src;
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'auto';
    overlay.style.visibility = 'visible';
  }
  function hideZoom() {
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = 'none';
    overlay.style.visibility = 'hidden';
  }
  bImages.forEach((img, idx) => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      showZoom(idx, bImages);
    });
  });
  colorImages.forEach((img, idx) => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      showZoom(idx, colorImages);
    });
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideZoom();
  });
  leftArrow.addEventListener('click', e => {
    e.stopPropagation();
    showZoom((currentZoomIndex + currentZoomGroup.length - 1) % currentZoomGroup.length, currentZoomGroup);
  });
  rightArrow.addEventListener('click', e => {
    e.stopPropagation();
    showZoom((currentZoomIndex + 1) % currentZoomGroup.length, currentZoomGroup);
  });
  document.addEventListener('keydown', e => {
    if (overlay.style.visibility === 'visible') {
      if (e.key === 'Escape') hideZoom();
      if (e.key === 'ArrowLeft') showZoom((currentZoomIndex + currentZoomGroup.length - 1) % currentZoomGroup.length, currentZoomGroup);
      if (e.key === 'ArrowRight') showZoom((currentZoomIndex + 1) % currentZoomGroup.length, currentZoomGroup);
    }
  });

  images.forEach(img => {
    if (img.src.includes('Binder2.pdf_Page_05.jpg')) {
      // Add click-to-center/expand logic
      img.addEventListener('click', () => {
        img.classList.toggle('expanded-center');
      });
      // Do not randomize or override styles for the fixed image
      return;
    }
    // Forbidden zone around the title
    const forbiddenTop = 0;
    const forbiddenLeft = 0;
    const forbiddenRight = window.innerWidth;
    const forbiddenBottom = 50; // px, adjust as needed for title height+margin

    let left, top, tries = 0;
    do {
      left = Math.random() * maxLeft;
      top = Math.random() * maxTop;
      tries++;
      // Check if the image would overlap the fixed image or the forbidden title zone
    } while (
      (
        // Overlap with fixed image
        left < fixedRight &&
        left + imgWidth > fixedLeft &&
        top < fixedBottom &&
        top + imgHeight > fixedTop
      ) ||
      (
        // Overlap with forbidden title zone
        left < forbiddenRight &&
        left + imgWidth > forbiddenLeft &&
        top < forbiddenBottom &&
        top + imgHeight > forbiddenTop
      )
      && tries < 50
    );
    img.style.left = left + 'px';
    img.style.top = top + 'px';
    img.style.width = imgWidth + 'px';
    img.style.height = 'auto';
    img.style.zIndex = 1;
    img.addEventListener('mouseenter', () => {
      img.style.zIndex = 1000;
    });
    img.addEventListener('mouseleave', () => {
      img.style.zIndex = 1;
    });
  });  // --- FILTER BUTTON LOGIC ---
  const bwBtn = document.getElementById('bw-filter-btn');
  const colorBtn = document.getElementById('color-filter-btn');
  let filterState = null; // 'bw', 'color', or null

  function isBW(img) {
    const src = img.src || '';
    const bwFiles = [
      '1B.jpg', '2B.jpg', '3B.jpg',
      'Binder2.pdf_Page_03.jpg', 'Binder2.pdf_Page_04.jpg', 'Binder2.pdf_Page_05.jpg',
      'Binder2.pdf_Page_06.jpg', 'Binder2.pdf_Page_07.jpg', 'Binder2.pdf_Page_08.jpg',
      'Binder2.pdf_Page_09.jpg', 'Binder2.pdf_Page_10.jpg', 'Binder2.pdf_Page_11.jpg',
      'Binder2.pdf_Page_12.jpg', 'Binder2.pdf_Page_13.jpg', 'Binder2.pdf_Page_14.jpg'
    ];
    return bwFiles.some(name => src.includes(name));
  }
  function isColor(img) {
    return !isBW(img) && !img.src.includes('Binder2.pdf_Page_05.jpg');
  }

  function applyFilter(type) {
    images.forEach(img => {
      if (img.src.includes('Binder2.pdf_Page_05.jpg')) return;
      if (type === 'bw') {
        if (isBW(img)) {
          img.style.opacity = '1.0';
          img.style.zIndex = 2;
        } else {
          img.style.opacity = '0.25';
          img.style.zIndex = 1;
        }
      } else if (type === 'color') {
        if (isColor(img)) {
          img.style.opacity = '1.0';
          img.style.zIndex = 2;
        } else {
          img.style.opacity = '0.25';
          img.style.zIndex = 1;
        }
      } else {
        img.style.opacity = '1.0';
        img.style.zIndex = 1;
      }
    });
  }

  const resetBtn = document.getElementById('reset-filter-btn');
  if (bwBtn && colorBtn && resetBtn) {
    bwBtn.addEventListener('click', () => {
      if (filterState === 'bw') {
        filterState = null;
        applyFilter(null);
        bwBtn.classList.remove('active');
      } else {
        filterState = 'bw';
        applyFilter('bw');
        bwBtn.classList.add('active');
        colorBtn.classList.remove('active');
      }
    });
    colorBtn.addEventListener('click', () => {
      if (filterState === 'color') {
        filterState = null;
        applyFilter(null);
        colorBtn.classList.remove('active');
      } else {
        filterState = 'color';
        applyFilter('color');
        colorBtn.classList.add('active');
        bwBtn.classList.remove('active');
      }
    });
    resetBtn.addEventListener('click', () => {
      filterState = null;
      applyFilter(null);
      bwBtn.classList.remove('active');
    const forbiddenLeft = 0;
      colorBtn.classList.remove('active');
    });
  }
// --- END FILTER BUTTON LOGIC ---

  // --- BUTTONS FIXED HALFWAY DOWN RIGHT ---
  const btns = document.getElementById('filter-buttons-container');
  if (btns) {
    btns.style.position = 'fixed';
    btns.style.top = '39%';
    btns.style.right = '24px';
    btns.style.left = 'auto';
    btns.style.transform = 'translateY(-50%)';
    btns.style.zIndex = 20000;
  }
  // Wait for all images to load before scrolling to top
  const allImgs = Array.from(document.images);
  Promise.all(
    allImgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; }))
  ).then(() => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);
  });

  window.onbeforeunload = () => window.scrollTo(0, 0);
});
