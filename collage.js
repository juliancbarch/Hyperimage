window.scrollTo(0, 0);
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  const images = Array.from(document.getElementsByClassName('collage-img'));

  // Shuffle images order
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    images[i].parentNode.insertBefore(images[j], images[i]);
  }

  const imgWidth = Math.min(window.innerWidth * 0.12, 200); // 12vw or max 200px
  const imgHeight = imgWidth * 1.4; // estimate aspect ratio
  const maxLeft = window.innerWidth - imgWidth - 10;
  const maxTop = window.innerHeight - imgHeight - 20; // fit within single viewport with bottom padding

  // Fixed image bounding box
  // Match CSS: position: fixed; top: 24px; right: 24px; width: 56vw (max 800px)
  const fixedTop = 24;
  const fixedWidth = Math.min(window.innerWidth * 0.56, 800);
  const fixedRight = window.innerWidth - 24;
  const fixedLeft = fixedRight - fixedWidth;
  // Research image appears to be landscape/wide format
  const fixedHeight = fixedWidth * 0.35; // reduced from 0.65 to match actual image height
  const fixedBottom = fixedTop + fixedHeight;

  // B-series, color, and non-b-series BW image logic
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


  images.forEach(img => {
    if (img.src.includes('Binder2.pdf_Page_05.jpg')) {
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
  });


  // Arrow key handler for zoom navigation
  document.addEventListener('keydown', (e) => {
    if (overlay.style.visibility === 'visible') {
      if (e.key === 'Escape') hideZoom();
      if (e.key === 'ArrowLeft') showZoom((currentZoomIndex + currentZoomGroup.length - 1) % currentZoomGroup.length, currentZoomGroup);
      if (e.key === 'ArrowRight') showZoom((currentZoomIndex + 1) % currentZoomGroup.length, currentZoomGroup);
      return;
    }
  });

  function isColor(img) {
    const src = img.src || '';
    const bwFiles = [
      '1B.jpg', '2B.jpg', '3B.jpg',
      'Binder2.pdf_Page_03.jpg', 'Binder2.pdf_Page_04.jpg', 'Binder2.pdf_Page_05.jpg',
      'Binder2.pdf_Page_06.jpg', 'Binder2.pdf_Page_07.jpg', 'Binder2.pdf_Page_08.jpg',
      'Binder2.pdf_Page_09.jpg', 'Binder2.pdf_Page_10.jpg', 'Binder2.pdf_Page_11.jpg',
      'Binder2.pdf_Page_12.jpg', 'Binder2.pdf_Page_13.jpg', 'Binder2.pdf_Page_14.jpg'
    ];
    const isBW = bwFiles.some(name => src.includes(name));
    return !isBW && !img.src.includes('Binder2.pdf_Page_05.jpg');
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

  // ========== WAYFINDING NAVIGATION SYSTEM ==========
  
  // Define nodes on the research image (Binder2.pdf_Page_05.jpg)
  // Grid-based navigation with spatial adjacency - all 47 nodes (including starting node0)
  // Each node has neighbors: { up, down, left, right } for arrow key navigation
  const wayfindingNodes = [
    // 0: STARTING POSITION - Title (top left)
    { id: 'node0', name: 'Housing Challenges Framework', x: 1.5, y: 6, imageSet: [], neighbors: { down: 'node1' } },
    
    // 1-7: LEFT VERTICAL CYCLE
    { id: 'node1', name: 'Housing Crisis', x: 2.5, y: 28, imageSet: ['DSC04337.jpg', 'DSC04342.jpg', 'DSC04343.jpg', 'Binder2.pdf_Page_13.jpg'], neighbors: { up: 'node0', down: 'node2', right: 'node14' } },
    { id: 'node2', name: 'Demand > Supply', x: 2.5, y: 38, imageSet: ['DSC04219-2.jpg', 'DSC04228.jpg', 'DSC04230.jpg'], neighbors: { up: 'node1', down: 'node3', right: 'node8' } },
    { id: 'node3', name: 'Increase Supply', x: 2.5, y: 48, imageSet: ['DSC04149.jpg', 'DSC04183.jpg', 'DSC04236.jpg'], neighbors: { up: 'node2', down: 'node4', right: 'node8' } },
    { id: 'node4', name: 'More Single Family Houses', x: 2.5, y: 58, imageSet: ['DSC04149.jpg', 'DSC04183.jpg', 'DSC04194.jpg'], neighbors: { up: 'node3', down: 'node5', right: 'node9' } },
    { id: 'node5', name: 'Supply Incompatible', x: 2.5, y: 70, imageSet: ['DSC04236.jpg', 'DSC04255.jpg', 'DSC04258.jpg'], neighbors: { up: 'node4', down: 'node6', right: 'node11' } },
    { id: 'node6', name: 'Problem Remain', x: 2.5, y: 82, imageSet: ['DSC04322.jpg', 'DSC04324.jpg', 'DSC04328.jpg'], neighbors: { up: 'node5', down: 'node7', right: 'node13' } },
    { id: 'node7', name: 'Cycle Continues', x: 2.5, y: 92, imageSet: ['DSC04322.jpg', 'DSC04337.jpg', 'DSC04342.jpg'], neighbors: { up: 'node6', right: 'node28' } },
    
    // 8-13: CENTER LEFT (Housing Problem as Typology Mismatch)
    { id: 'node8', name: 'Type of Living', x: 11, y: 48, imageSet: ['1B.jpg', '2B.jpg', '3B.jpg', '3S.jpg'], neighbors: { left: 'node3', down: 'node9', right: 'node14' } },
    { id: 'node9', name: 'Demand', x: 11, y: 56, imageSet: ['DSC04266.jpg', 'DSC04267.jpg', 'DSC04275.jpg'], neighbors: { up: 'node8', left: 'node4', down: 'node11', right: 'node10' } },
    { id: 'node10', name: 'Always Changing', x: 22, y: 56, imageSet: ['1B.jpg', '2B.jpg', '3B.jpg'], neighbors: { left: 'node9', down: 'node12', right: 'node17' } },
    { id: 'node11', name: 'Supply', x: 11, y: 66, imageSet: ['1B.jpg', '2B.jpg', '3S.jpg'], neighbors: { up: 'node9', left: 'node5', down: 'node13', right: 'node12' } },
    { id: 'node12', name: 'Rigid', x: 28, y: 66, imageSet: ['3S.jpg', '3B.jpg', '2B.jpg'], neighbors: { up: 'node10', left: 'node11', right: 'node18' } },
    { id: 'node13', name: 'Type Of', x: 11, y: 74, imageSet: ['DSC04236.jpg', 'DSC04255.jpg', 'DSC04258.jpg'], neighbors: { up: 'node11', left: 'node6', right: 'node21' } },
    
    // 14-19: CENTER
    { id: 'node14', name: 'Aging Population', x: 32, y: 48, imageSet: ['Binder2.pdf_Page_04.jpg', 'Binder2.pdf_Page_06.jpg', 'Binder2.pdf_Page_07.jpg', 'Binder2.pdf_Page_08.jpg'], neighbors: { left: 'node8', down: 'node17', right: 'node15' } },
    { id: 'node15', name: 'Renting Problem', x: 42, y: 48, imageSet: ['Binder2.pdf_Page_09.jpg', 'Binder2.pdf_Page_10.jpg', 'Binder2.pdf_Page_11.jpg'], neighbors: { left: 'node14', down: 'node19', right: 'node16' } },
    { id: 'node16', name: 'Changing Household', x: 52, y: 48, imageSet: ['Binder2.pdf_Page_11.jpg', 'Binder2.pdf_Page_12.jpg', 'Binder2.pdf_Page_13.jpg', 'Binder2.pdf_Page_14.jpg'], neighbors: { left: 'node15', down: 'node19', right: 'node23' } },
    { id: 'node17', name: 'Demand', x: 32, y: 56, imageSet: ['DSC04219-2.jpg', 'DSC04228.jpg', 'DSC04230.jpg'], neighbors: { up: 'node14', left: 'node10', down: 'node18', right: 'node27' } },
    { id: 'node18', name: 'Supply', x: 32, y: 66, imageSet: ['DSC04236.jpg', 'DSC04255.jpg', 'DSC04258.jpg'], neighbors: { up: 'node17', left: 'node12', right: 'node19' } },
    { id: 'node19', name: 'Existing', x: 42, y: 66, imageSet: ['DSC04149.jpg', 'DSC04183.jpg', 'DSC04194.jpg'], neighbors: { up: 'node15', left: 'node18', right: 'node22' } },
    
    // 21-26: RIGHT SIDE VERTICAL
    { id: 'node21', name: 'Property Value Increase', x: 64, y: 82, imageSet: ['DSC04290.jpg', 'DSC04305.jpg', 'DSC04318.jpg'], neighbors: { up: 'node22', down: 'node28', right: 'node30' } },
    { id: 'node22', name: 'Property Tax Increase', x: 64, y: 70, imageSet: ['DSC04322.jpg', 'DSC04324.jpg', 'DSC04328.jpg'], neighbors: { up: 'node23', down: 'node21', right: 'node29' } },
    { id: 'node23', name: 'Cost of Living Increase', x: 64, y: 50, imageSet: ['DSC04357.jpg', 'DSC04358.jpg', 'DSC04360.jpg'], neighbors: { up: 'node24', left: 'node16', down: 'node22', right: 'node27' } },
    { id: 'node24', name: 'Less Affordable', x: 64, y: 36, imageSet: ['DSC04322.jpg', 'DSC04324.jpg', 'DSC04328.jpg'], neighbors: { down: 'node23', left: 'node16', right: 'node25' } },
    { id: 'node25', name: 'Elderly Priced Out', x: 70, y: 36, imageSet: ['DSC04367.jpg', 'DSC04371.jpg', 'DSC04385.jpg'], neighbors: { left: 'node24', right: 'node35' } },
    { id: 'node26', name: 'Less Housing', x: 82, y: 24, imageSet: ['DSC04391.jpg', 'DSC04394.jpg', 'DSC04397.jpg'], neighbors: { left: 'node35', right: 'node34' } },
    
    // 27-33: MIDDLE RIGHT
    { id: 'node27', name: 'Narrow Tax Base', x: 76, y: 58, imageSet: ['DSC04413.jpg', 'DSC04415.jpg', 'DSC04435.jpg'], neighbors: { left: 'node23', down: 'node29', right: 'node38' } },
    { id: 'node28', name: 'County/State Housing Market', x: 64, y: 94, imageSet: ['DSC04219-2.jpg', 'DSC04228.jpg', 'DSC04230.jpg'], neighbors: { up: 'node21', left: 'node7', right: 'node44' } },
    { id: 'node29', name: 'Pressure on Services', x: 76, y: 70, imageSet: ['DSC04290.jpg', 'DSC04305.jpg', 'DSC04318.jpg'], neighbors: { up: 'node27', left: 'node22', down: 'node30', right: 'node46' } },
    { id: 'node30', name: 'Tax Per Capita Increase', x: 70, y: 80, imageSet: ['Binder2.pdf_Page_04.jpg', 'Binder2.pdf_Page_06.jpg', 'Binder2.pdf_Page_07.jpg'], neighbors: { up: 'node29', left: 'node21', right: 'node31' } },
    { id: 'node31', name: 'Echo Chamber Effect', x: 82, y: 80, imageSet: ['DSC04446.jpg', 'DSC04447.jpg', 'DSC04367.jpg'], neighbors: { left: 'node30', down: 'node44', up: 'node45' } },
    { id: 'node32', name: 'Less Incoming Families', x: 88, y: 50, imageSet: ['DSC04266.jpg', 'DSC04267.jpg', 'DSC04275.jpg'], neighbors: { left: 'node38', down: 'node46', right: 'node40' } },
    { id: 'node33', name: 'Less Funding', x: 88, y: 40, imageSet: ['DSC04357.jpg', 'DSC04358.jpg', 'DSC04360.jpg'], neighbors: { down: 'node32', up: 'node40', left: 'node27', right: 'node37' } },
    
    // 34-46: FAR RIGHT
    { id: 'node34', name: 'Cut Programs', x: 88, y: 24, imageSet: ['DSC04322.jpg', 'DSC04324.jpg', 'DSC04328.jpg'], neighbors: { left: 'node26', right: 'node36' } },
    { id: 'node35', name: 'Elderly Priced Out', x: 76, y: 24, imageSet: ['DSC04357.jpg', 'DSC04358.jpg', 'DSC04360.jpg'], neighbors: { left: 'node25', right: 'node26' } },
    { id: 'node36', name: 'Less Affordable', x: 94, y: 24, imageSet: ['DSC04322.jpg', 'DSC04324.jpg', 'DSC04328.jpg'], neighbors: { left: 'node34', down: 'node37' } },
    { id: 'node37', name: 'Decrease Enrollments', x: 94, y: 36, imageSet: ['DSC04357.jpg', 'DSC04358.jpg', 'DSC04360.jpg'], neighbors: { up: 'node36', down: 'node40' } },
    { id: 'node38', name: 'Development', x: 82, y: 50, imageSet: ['DSC04391.jpg', 'DSC04394.jpg', 'DSC04397.jpg'], neighbors: { left: 'node27', right: 'node32', down: 'node46' } },
    { id: 'node39', name: 'Relocate', x: 76, y: 46, imageSet: ['DSC04367.jpg', 'DSC04371.jpg', 'DSC04385.jpg'], neighbors: { up: 'node27', down: 'node29', left: 'node23', right: 'node38' } },
    { id: 'node40', name: 'Lower Resident Capacity', x: 94, y: 50, imageSet: ['DSC04357.jpg', 'DSC04358.jpg', 'DSC04360.jpg'], neighbors: { up: 'node37', down: 'node42', left: 'node33' } },
    { id: 'node41', name: 'Resistance from Residence', x: 96, y: 70, imageSet: ['DSC04413.jpg', 'DSC04415.jpg', 'DSC04435.jpg'], neighbors: { up: 'node42', down: 'node43', left: 'node46' } },
    { id: 'node42', name: 'Resistance', x: 96, y: 58, imageSet: ['DSC04446.jpg', 'DSC04447.jpg', 'DSC04367.jpg'], neighbors: { up: 'node40', down: 'node41', left: 'node32' } },
    { id: 'node43', name: 'Property Value Concerns', x: 96, y: 94, imageSet: ['DSC04290.jpg', 'DSC04305.jpg', 'DSC04318.jpg'], neighbors: { up: 'node41', left: 'node44' } },
    { id: 'node44', name: 'Homogeneous Demographics', x: 82, y: 94, imageSet: ['DSC04367.jpg', 'DSC04371.jpg', 'DSC04385.jpg'], neighbors: { up: 'node31', left: 'node28', right: 'node43' } },
    { id: 'node45', name: 'Small Village Character', x: 88, y: 82, imageSet: ['DSC04446.jpg', 'DSC04447.jpg', 'DSC04367.jpg'], neighbors: { down: 'node31', left: 'node30', right: 'node41' } },
    { id: 'node46', name: 'Development', x: 82, y: 70, imageSet: ['DSC04391.jpg', 'DSC04394.jpg', 'DSC04397.jpg'], neighbors: { up: 'node38', left: 'node29', down: 'node31', right: 'node32' } }
  ];

  // Create navigation box
  const navBox = document.createElement('div');
  navBox.className = 'wayfinding-box';
  document.body.appendChild(navBox);

  // Create drift toggle button
  const driftToggleBtn = document.createElement('button');
  driftToggleBtn.className = 'drift-toggle-btn';
  driftToggleBtn.innerHTML = '⏸'; // Pause symbol (since drifting starts enabled)
  driftToggleBtn.title = 'Toggle image drift animation';
  document.body.appendChild(driftToggleBtn);

  let currentNodeId = 'node0'; // Start at title node with all images blurred
  let wayfindingActive = true; // Start active by default
  
  // Helper function to get node by ID
  function getNodeById(id) {
    return wayfindingNodes.find(node => node.id === id);
  }
  
  // Helper function to get current node index
  function getCurrentNodeIndex() {
    return wayfindingNodes.findIndex(node => node.id === currentNodeId);
  }

  // Get the research image element
  const researchImage = images.find(img => img.src.includes('Binder2.pdf_Page_05.jpg'));

  // Add click handler to toggle enlarged view for Binder2.pdf_Page_05.jpg
  if (researchImage) {
    researchImage.addEventListener('click', (e) => {
      e.stopPropagation();
      researchImage.classList.toggle('expanded-center');
      // Update navigation box position when toggling
      if (wayfindingActive) {
        updateNavBoxPosition();
      }
    });
  }

  // Function to calculate absolute position of navigation box
  function updateNavBoxPosition() {
    if (!researchImage || !wayfindingActive) {
      navBox.style.display = 'none';
      return;
    }

    navBox.style.display = 'block';
    const node = getNodeById(currentNodeId);
    if (!node) return;
    const rect = researchImage.getBoundingClientRect();
    
    // Calculate position based on node percentages
    const boxLeft = rect.left + (rect.width * node.x / 100) - 4; // center the 8px dot
    const boxTop = rect.top + (rect.height * node.y / 100) - 4;
    
    navBox.style.left = boxLeft + 'px';
    navBox.style.top = boxTop + 'px';
  }

  // Animation state for drifting images
  const driftingImages = new Map(); // Store animation state for each image
  let animationFrameId = null;
  let driftingEnabled = true; // Global toggle for drifting animation

  // Function to start drifting animation for an image
  function startDrifting(img) {
    if (!driftingImages.has(img)) {
      const currentLeft = parseFloat(img.style.left) || 0;
      driftingImages.set(img, {
        left: currentLeft,
        speed: 0.15 + Math.random() * 0.25 // Random speed between 0.15-0.4 px per frame
      });
    }
  }

  // Function to stop drifting animation for an image
  function stopDrifting(img) {
    driftingImages.delete(img);
  }

  // Animation loop for drifting images
  function animateDrifting() {
    const viewportWidth = window.innerWidth;
    const imgWidth = Math.min(window.innerWidth * 0.12, 200);

    // Only animate if drifting is enabled
    if (driftingEnabled) {
      driftingImages.forEach((state, img) => {
        // Move image to the right
        state.left += state.speed;
        
        // If image goes off the right edge, wrap to left
        if (state.left > viewportWidth) {
          state.left = -imgWidth;
        }
        
        img.style.left = state.left + 'px';
      });
    }

    animationFrameId = requestAnimationFrame(animateDrifting);
  }

  // Start the animation loop
  animateDrifting();

  // Function to apply blur to all collage images (except research image and special images)
  function blurAllImages() {
    images.forEach(img => {
      if (!img.src.includes('Binder2.pdf_Page_05.jpg')) {
        img.classList.add('blurred');
        img.classList.remove('unblurred');
        startDrifting(img); // Start drifting when blurred
      }
    });
  }

  // Function to unblur images associated with current node and bring them to front
  function updateImageBlur() {
    const currentNode = getNodeById(currentNodeId);
    if (!currentNode) return;
    
    images.forEach(img => {
      if (img.src.includes('Binder2.pdf_Page_05.jpg')) {
        return; // Skip research image
      }

      // Check if this image is in the current node's image set
      const isInCurrentSet = currentNode.imageSet.some(filename => img.src.includes(filename));
      
      if (isInCurrentSet) {
        img.classList.remove('blurred');
        img.classList.add('unblurred');
        // Bring unblurred images to front
        img.style.zIndex = 5000;
        // Stop drifting for unblurred images (make them stationary)
        stopDrifting(img);
      } else {
        img.classList.add('blurred');
        img.classList.remove('unblurred');
        // Send blurred images to back
        img.style.zIndex = 1;
        // Start drifting for blurred images
        startDrifting(img);
      }
    });
  }

  // Directional navigation functions
  function moveUp() {
    const currentNode = getNodeById(currentNodeId);
    if (currentNode && currentNode.neighbors && currentNode.neighbors.up) {
      currentNodeId = currentNode.neighbors.up;
      updateNavBoxPosition();
      updateImageBlur();
    }
  }
  
  function moveDown() {
    const currentNode = getNodeById(currentNodeId);
    if (currentNode && currentNode.neighbors && currentNode.neighbors.down) {
      currentNodeId = currentNode.neighbors.down;
      updateNavBoxPosition();
      updateImageBlur();
    }
  }
  
  function moveLeft() {
    const currentNode = getNodeById(currentNodeId);
    if (currentNode && currentNode.neighbors && currentNode.neighbors.left) {
      currentNodeId = currentNode.neighbors.left;
      updateNavBoxPosition();
      updateImageBlur();
    }
  }
  
  function moveRight() {
    const currentNode = getNodeById(currentNodeId);
    if (currentNode && currentNode.neighbors && currentNode.neighbors.right) {
      currentNodeId = currentNode.neighbors.right;
      updateNavBoxPosition();
      updateImageBlur();
    }
  }

  // Function to activate wayfinding mode
  function activateWayfinding() {
    wayfindingActive = true;
    currentNodeId = 'node0'; // Start at title node
    blurAllImages();
    updateNavBoxPosition();
    updateImageBlur();
  }

  // Function to deactivate wayfinding mode
  function deactivateWayfinding() {
    wayfindingActive = false;
    navBox.style.display = 'none';
    
    // Remove blur from all images and restore normal z-index
    images.forEach(img => {
      img.classList.remove('blurred');
      img.classList.remove('unblurred');
      // Restore default z-index (except for special images)
      if (!img.src.includes('Binder2.pdf_Page_05.jpg')) {
        img.style.zIndex = 1;
      }
      // Stop all drifting when wayfinding is deactivated
      stopDrifting(img);
    });
  }

  // Initialize wayfinding on page load
  activateWayfinding();

  // Drift toggle button click handler
  driftToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    driftingEnabled = !driftingEnabled;
    driftToggleBtn.innerHTML = driftingEnabled ? '⏸' : '▶'; // Pause or Play symbol
    driftToggleBtn.title = driftingEnabled ? 'Pause image drift' : 'Resume image drift';
  });

  // Wayfinding arrow key navigation
  document.addEventListener('keydown', (e) => {
    // Skip if zoom overlay is active
    if (overlay.style.visibility === 'visible') {
      return;
    }
    
    // If wayfinding is active, handle arrow keys for directional navigation
    if (wayfindingActive) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveUp();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveDown();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveLeft();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveRight();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        deactivateWayfinding();
        return;
      }
    } else {
      // If wayfinding is not active, pressing any arrow key activates it
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        activateWayfinding();
        return;
      }
    }
  });

  // Update navigation box position on window resize
  window.addEventListener('resize', () => {
    if (wayfindingActive) {
      updateNavBoxPosition();
    }
  });

  // Update position when research image is expanded/collapsed
  if (researchImage) {
    const observer = new MutationObserver(() => {
      if (wayfindingActive) {
        updateNavBoxPosition();
      }
    });
    observer.observe(researchImage, { attributes: true, attributeFilter: ['class'] });
  }
});
