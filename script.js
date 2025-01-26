document.addEventListener('DOMContentLoaded', () => {
    const colorPickerToggle = document.querySelector('.color-picker-toggle');
    const colorPickerMenu = document.querySelector('.color-picker-menu');
    
    const colorOptions = document.querySelectorAll('.color-option');

    function updateFavicon(color) {
        const faviconLink = document.querySelector("link[rel~='icon']");
        if (!faviconLink) {
            const newFaviconLink = document.createElement('link');
            newFaviconLink.rel = 'icon';
            newFaviconLink.type = 'image/svg+xml';
            document.head.appendChild(newFaviconLink);
            faviconLink = newFaviconLink;
        }

        const svgFavicon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
        `;

        const blob = new Blob([svgFavicon], { type: 'image/svg+xml' });
        faviconLink.href = URL.createObjectURL(blob);
    }

    // Initialize color options with current theme color
    colorOptions.forEach(option => {
        option.style.backgroundColor = option.getAttribute('data-color');
        
        option.addEventListener('mouseenter', function() {
            const color = this.getAttribute('data-color');
            const rgbColor = hexToRgb(color);
            this.style.boxShadow = `0 0 10px rgba(${rgbColor}, 0.5)`;
        });

        option.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });

    // Convert hex to RGB
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `${r},${g},${b}`;
    }

    // Color picker toggle
    colorPickerToggle.addEventListener('click', () => {
        colorPickerMenu.classList.toggle('open');
    });

    // Close color picker when clicking outside
    document.addEventListener('click', (event) => {
        if (!colorPickerToggle.contains(event.target) && 
            !colorPickerMenu.contains(event.target)) {
            colorPickerMenu.classList.remove('open');
        }
    });

    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color');
            const rgbColor = hexToRgb(selectedColor);
            
            // Update CSS variables
            document.documentElement.style.setProperty('--accent-color', selectedColor);
            document.documentElement.style.setProperty('--accent-rgb', rgbColor);

            // Update social bubble icons
            document.querySelectorAll('.social-bubble i').forEach(icon => {
                icon.style.color = selectedColor;
            });

            // Update favicon color
            updateFavicon(selectedColor);

            // Update particles color
            if (window.pJSDom && window.pJSDom[0]) {
                const pJS = window.pJSDom[0].pJS;
                
                // Modify existing particle configuration
                pJS.particles.color.value = selectedColor;
                pJS.particles.line_linked.color = selectedColor;
                
                // Properly refresh particles
                pJS.fn.particlesRefresh();
            }

            // Close color picker menu
            colorPickerMenu.classList.remove('open');
        });
    });

    // Social bubble interactions
    document.querySelectorAll('.social-bubble').forEach(bubble => {
        bubble.addEventListener('touchstart', function() {
            this.classList.add('active');
        });

        bubble.addEventListener('touchend', function() {
            this.classList.remove('active');
            const link = this.getAttribute('data-link');
            window.open(link, '_blank');
        });

        bubble.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            window.open(link, '_blank');
        });
    });

    // Particles.js configuration
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#EAB31A' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { 
                enable: true, 
                distance: 150, 
                color: '#EAB31A', 
                opacity: 0.4, 
                width: 1 
            },
            move: { 
                enable: true, 
                speed: 2, 
                direction: 'none', 
                random: false, 
                straight: false, 
                out_mode: 'out', 
                bounce: false 
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });
});