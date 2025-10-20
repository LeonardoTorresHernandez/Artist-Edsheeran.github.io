// JavaScript for smooth scrolling and animations

document.addEventListener("DOMContentLoaded", function() {
    const list = [
        ['love', 100],
        ['pain', 50],
        ['perfect', 80],
        ['thinking', 70],
        ['loud', 60],
        ['heart', 90],
        ['home', 40],
        ['baby', 55],
        ['photograph', 45],
        ['bloodstream', 35],
    ];
    const wordCloudEl = document.getElementById('word-cloud');
    if (wordCloudEl && window.WordCloud) {
        WordCloud(wordCloudEl, {
            list: list,
            hover: (item, dimension, event) => {
                if (dimension) {
                    event.target.style.textShadow = '0 0 10px #fff, 0 0 10px #fff';
                } else {
                    event.target.style.textShadow = '';
                }
            },
        });
    }

    // Reveal transitions for sections
    const sections = Array.from(document.querySelectorAll('section.reveal'));
    if (sections.length) {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if ('IntersectionObserver' in window && !prefersReduced) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            }, { root: null, threshold: 0.2 });
            sections.forEach((s) => io.observe(s));
        } else {
            sections.forEach((s) => s.classList.add('is-visible'));
        }
    }

    // ========================================
    // Section 4: Global Impact Visualization
    // Animated energy waves emanating from UK
    // ========================================
    
    const mapContainer = document.getElementById('map');
    let map = null;
    if (mapContainer && window.maplibregl) {
        map = new maplibregl.Map({
            container: 'map',
            style: {
                'version': 8,
                'sources': {
                    'raster-tiles': {
                        'type': 'raster',
                        'tiles': ['https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'],
                        'tileSize': 256,
                        'attribution': '© OpenStreetMap contributors © CARTO'
                    }
                },
                'layers': [{
                    'id': 'simple-tiles',
                    'type': 'raster',
                    'source': 'raster-tiles',
                    'minzoom': 0,
                    'maxzoom': 22
                }],
                'glyphs': 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
            },
            center: [0, 20],
            zoom: 1.5,
            pitch: 0,
            bearing: 0,
            interactive: false
        });
    }

    if (map) map.on('load', function () {
        // Origin point: United Kingdom (London)
        const origin = [-0.1278, 51.5074];
        
        // Major global destinations representing worldwide reach
        const destinations = [
            { coords: [-74.006, 40.7128], name: 'North America' },      // New York
            { coords: [-118.2437, 34.0522], name: 'West Coast' },       // Los Angeles
            { coords: [139.6917, 35.6895], name: 'Asia Pacific' },      // Tokyo
            { coords: [151.2093, -33.8688], name: 'Oceania' },          // Sydney
            { coords: [-43.1729, -22.9068], name: 'South America' },    // Rio
            { coords: [28.0473, -26.2041], name: 'Africa' },            // Johannesburg
            { coords: [77.2090, 28.6139], name: 'South Asia' },         // Delhi
            { coords: [103.8198, 1.3521], name: 'Southeast Asia' },     // Singapore
            { coords: [2.3522, 48.8566], name: 'Continental Europe' },  // Paris
            { coords: [37.6173, 55.7558], name: 'Eastern Europe' }      // Moscow
        ];

        // Add lines from UK to destinations
        const lineIds = [];
        destinations.forEach((dest, index) => {
            const lineId = `line-${index}`;
            const lineCoords = [origin, dest.coords];
            
            map.addSource(lineId, {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': lineCoords
                    }
                }
            });
            
            map.addLayer({
                'id': lineId,
                'type': 'line',
                'source': lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff6b6b',
                    'line-width': 2,
                    'line-opacity': 0.35,
                    'line-blur': 0.5,
                    'line-dasharray': [0, 4, 2, 4]
                }
            });
            lineIds.push(lineId);
        });

        // Animate dashed lines to create a flowing effect
        const dashArraySequence = [
            [0, 4, 3, 4],
            [1, 4, 2, 4],
            [2, 4, 1, 4],
            [3, 4, 0, 4]
        ];
        let dashStep = 0;
        function animateDashes() {
            lineIds.forEach((id) => {
                map.setPaintProperty(id, 'line-dasharray', dashArraySequence[dashStep]);
            });
            dashStep = (dashStep + 1) % dashArraySequence.length;
            setTimeout(animateDashes, 90);
        }
        animateDashes();

        // Add pulsing dots at destinations
        const destinationPoints = {
            'type': 'FeatureCollection',
            'features': destinations.map(dest => ({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': dest.coords
                }
            }))
        };

        map.addSource('destinations', {
            'type': 'geojson',
            'data': destinationPoints
        });

        map.addLayer({
            'id': 'destination-points',
            'type': 'circle',
            'source': 'destinations',
            'paint': {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0, 3,
                    5, 8
                ],
                'circle-color': '#ff6b6b',
                'circle-opacity': 0.8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.5
            }
        });

        // Central origin point (UK) - larger and more prominent
        map.addSource('origin-point', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': origin
                }
            }
        });

        map.addLayer({
            'id': 'origin-glow',
            'type': 'circle',
            'source': 'origin-point',
            'paint': {
                'circle-radius': 20,
                'circle-color': '#ff6b6b',
                'circle-opacity': 0.2,
                'circle-blur': 1
            }
        });

        map.addLayer({
            'id': 'origin-point',
            'type': 'circle',
            'source': 'origin-point',
            'paint': {
                'circle-radius': 8,
                'circle-color': '#ff4444',
                'circle-opacity': 1,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Animate pulsing effect on origin
        let pulseRadius = 8;
        let growing = true;
        
        function animateOriginPulse() {
            if (growing) {
                pulseRadius += 0.3;
                if (pulseRadius >= 12) growing = false;
            } else {
                pulseRadius -= 0.3;
                if (pulseRadius <= 8) growing = true;
            }
            
            map.setPaintProperty('origin-point', 'circle-radius', pulseRadius);
            requestAnimationFrame(animateOriginPulse);
        }
        
        animateOriginPulse();
    });

    // ========================================
    // Supplemental Canvas Animation (No external sources)
    // Orthographic globe with graticule, simplified continents, and pulses
    // ========================================
    const impactCanvas = document.getElementById('impact-canvas');
    if (impactCanvas) {
        const ctx = impactCanvas.getContext('2d');
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function resizeCanvas() {
            const cssW = impactCanvas.clientWidth;
            const cssH = impactCanvas.clientHeight;
            impactCanvas.width = Math.floor(cssW * dpr);
            impactCanvas.height = Math.floor(cssH * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Data: origin and destinations (lon/lat in degrees)
        const originLL = { lon: -0.1278, lat: 51.5074 }; // UK (London)
        const nodesLL = [
            { lon: -74.006, lat: 40.7128 },   // NYC
            { lon: -118.2437, lat: 34.0522 }, // LA
            { lon: 139.6917, lat: 35.6895 },  // Tokyo
            { lon: 151.2093, lat: -33.8688 }, // Sydney
            { lon: -43.1729, lat: -22.9068 }, // Rio
            { lon: 28.0473, lat: -26.2041 },  // Johannesburg
            { lon: 77.209, lat: 28.6139 },    // Delhi
            { lon: 103.8198, lat: 1.3521 },   // Singapore
            { lon: 2.3522, lat: 48.8566 },    // Paris
            { lon: 37.6173, lat: 55.7558 },   // Moscow
        ];
        // Orthographic projection utilities
        const DEG = Math.PI/180;
        function orthoProject(lon, lat, centerLon, centerLat, R, cx, cy) {
            const λ = (lon - centerLon) * DEG;
            const φ = lat * DEG;
            const φ0 = centerLat * DEG;
            const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
            const cosφ0 = Math.cos(φ0), sinφ0 = Math.sin(φ0);
            const cosλ = Math.cos(λ), sinλ = Math.sin(λ);
            const x = R * cosφ * sinλ;
            const y = R * (cosφ0 * sinφ - sinφ0 * cosφ * cosλ);
            const z = sinφ0 * sinφ + cosφ0 * cosφ * cosλ; // visibility (>0 front)
            return { x: cx + x, y: cy + y, z };
        }

        // Simplified continent polygons (very coarse), arrays of lon/lat pairs
        const landPolys = [
            // North America (very rough)
            [
                [-168, 72], [-140, 70], [-125, 60], [-110, 50], [-100, 45], [-95, 40], [-90, 30], [-100, 20], [-110, 20], [-120, 25], [-130, 30], [-140, 40], [-150, 55], [-160, 65]
            ],
            // South America (rough)
            [
                [-80, 12], [-70, 5], [-65, -5], [-60, -10], [-58, -20], [-60, -30], [-65, -40], [-70, -45], [-75, -40], [-78, -20], [-80, -5]
            ],
            // Europe + Africa (very rough)
            [
                [-10, 60], [5, 60], [20, 60], [30, 55], [35, 45], [40, 35], [30, 30], [20, 25], [15, 20], [10, 10], [5, 0], [0, -10], [-5, -20], [-10, -30], [0, -35], [10, -25], [20, -10], [10, 0], [0, 10], [-5, 40]
            ],
            // Asia (rough)
            [
                [30, 55], [60, 55], [80, 50], [100, 45], [120, 40], [140, 45], [150, 55], [140, 60], [120, 60], [100, 60], [80, 55], [60, 50], [45, 45]
            ],
            // Australia (rough)
            [
                [110, -10], [120, -15], [130, -20], [140, -25], [150, -30], [145, -35], [135, -35], [125, -30], [115, -25]
            ],
            // Greenland/Iceland hint
            [
                [-45, 65], [-30, 70], [-20, 70], [-25, 65], [-35, 62]
            ]
        ];

        // Globe state
        let centerLon = -10; // centered near Atlantic
        let centerLat = 20;
        const globe = { cx: 0, cy: 0, R: 0 };

        function updateGlobeMetrics() {
            const w = impactCanvas.clientWidth;
            const h = impactCanvas.clientHeight;
            const R = Math.min(w, h) * 0.45;
            globe.cx = w/2;
            globe.cy = h/2;
            globe.R = R;
        }
        updateGlobeMetrics();
        window.addEventListener('resize', updateGlobeMetrics, { passive: true });

        function drawSphere() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(globe.cx, globe.cy, globe.R, 0, Math.PI*2);
            ctx.fillStyle = '#0b0b0e';
            ctx.fill();
            const grad = ctx.createRadialGradient(globe.cx*0.9, globe.cy*0.8, globe.R*0.2, globe.cx, globe.cy, globe.R);
            grad.addColorStop(0, 'rgba(255,255,255,0.05)');
            grad.addColorStop(1, 'rgba(0,0,0,0.0)');
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        }

        function drawGraticule() {
            ctx.save();
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            for (let lon = -180; lon <= 180; lon += 15) {
                ctx.beginPath();
                let started = false;
                for (let lat = -89; lat <= 89; lat += 2) {
                    const p = orthoProject(lon, lat, centerLon, centerLat, globe.R, globe.cx, globe.cy);
                    if (p.z <= 0) { started = false; continue; }
                    if (!started) { ctx.moveTo(p.x, p.y); started = true; } else { ctx.lineTo(p.x, p.y); }
                }
                ctx.stroke();
            }
            for (let lat = -75; lat <= 75; lat += 15) {
                ctx.beginPath();
                let started = false;
                for (let lon = -180; lon <= 180; lon += 2) {
                    const p = orthoProject(lon, lat, centerLon, centerLat, globe.R, globe.cx, globe.cy);
                    if (p.z <= 0) { started = false; continue; }
                    if (!started) { ctx.moveTo(p.x, p.y); started = true; } else { ctx.lineTo(p.x, p.y); }
                }
                ctx.stroke();
            }
            ctx.restore();
        }

        function drawLand() {
            ctx.save();
            ctx.fillStyle = 'rgba(200,200,210,0.08)';
            ctx.strokeStyle = 'rgba(255,255,255,0.10)';
            ctx.lineWidth = 1;
            landPolys.forEach(poly => {
                ctx.beginPath();
                let firstDrawn = false;
                for (let i = 0; i < poly.length; i++) {
                    const [lon, lat] = poly[i];
                    const p = orthoProject(lon, lat, centerLon, centerLat, globe.R, globe.cx, globe.cy);
                    if (p.z <= 0) { continue; }
                    if (!firstDrawn) { ctx.moveTo(p.x, p.y); firstDrawn = true; } else { ctx.lineTo(p.x, p.y); }
                }
                if (firstDrawn) {
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            });
            ctx.restore();
        }

        function drawPoint(ll, color, size=3) {
            const p = orthoProject(ll.lon, ll.lat, centerLon, centerLat, globe.R, globe.cx, globe.cy);
            if (p.z <= 0) return null; // back-side
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI*2);
            ctx.fillStyle = color;
            ctx.fill();
            return p;
        }

        function drawPulse(a, b, t, speed) {
            if (!a || !b) return;
            const s = (t*speed) % 1;
            const x = a.x + (b.x - a.x) * s;
            const y = a.y + (b.y - a.y) * s;
            ctx.save();
            ctx.shadowColor = 'rgba(255,107,107,0.5)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = 'rgba(255,107,107,0.9)';
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        let start = undefined;
        function frame(ts) {
            if (start === undefined) start = ts;
            const t = (ts - start) / 1000; // seconds

            const w = impactCanvas.clientWidth;
            const h = impactCanvas.clientHeight;
            ctx.clearRect(0, 0, w, h);

            // Slow rotation around vertical axis
            if (!prefersReduced) centerLon = -10 + (t * 6) % 360; // ~6°/s

            drawSphere();
            drawGraticule();
            drawLand();

            // Points
            const pOrigin = drawPoint(originLL, '#ff4444', 4);
            const visibleDest = nodesLL.map(ll => drawPoint(ll, 'rgba(255,255,255,0.7)', 2));

            // Pulses along straight screen paths when visible
            visibleDest.forEach((pd, i) => {
                if (!pd || !pOrigin) return;
                // Only draw if both are on the front hemisphere (approximate)
                drawPulse(pOrigin, pd, t + i*0.2, 0.6 + (i%3)*0.15);
            });

            if (!prefersReduced) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

});
