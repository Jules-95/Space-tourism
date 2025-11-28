/*
 * FICHIER: DiagramRenderer.js
 * DESCRIPTION: Rendu des diagrammes (Principe SOLID: Single Responsibility)
 * 
 * RÔLE: Cette classe a UNE SEULE responsabilité - générer et afficher les diagrammes.
 * Elle utilise C3.js/D3.js pour créer des visualisations des données de travelTime.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne gère QUE le rendu des diagrammes
 * - Open/Closed Principle (OCP): Peut être étendue avec de nouveaux types de diagrammes
 * 
 * UTILISATION:
 * 1. Créer une instance: const renderer = new DiagramRenderer()
 * 2. Rendre un diagramme: renderer.renderTravelTimeChart(containerId, data)
 */
class DiagramRenderer {
    constructor() {
        this.chart = null;  // Référence au diagramme C3 actuel
    }

    /*
     * MÉTHODE: renderTravelTimeChart()
     * DESCRIPTION: Crée un diagramme en barres des temps de voyage avec C3.js
     * PARAMÈTRE: containerId - ID de l'élément conteneur pour le diagramme
     * PARAMÈTRE: data - données formatées pour C3.js
     * 
     * CONFIGURATION C3:
     * - Type: bar chart
     * - Couleurs: thème espace (bleu, blanc)
     * - Labels: noms des destinations
     * - Tooltip: affiche le temps de voyage original
     */
    renderTravelTimeChart(containerId, data) {
        if (!data || !data.columns) {
            console.error('Données invalides pour le diagramme');
            return;
        }

        // Détruire le diagramme existant s'il y en a un
        if (this.chart) {
            this.chart.destroy();
        }

        // Vérifier que C3 est disponible
        if (typeof c3 === 'undefined') {
            throw new Error('La bibliothèque C3.js n\'est pas chargée');
        }

        // Créer le diagramme avec C3.js
        this.chart = c3.generate({
            bindto: `#${containerId}`,
            data: {
                columns: data.columns,
                type: 'bar',
                colors: {
                    travelTime: '#4EA8DE'  // Couleur bleue espace
                },
                labels: {
                    format: function (v, id, i, j) {
                        // Afficher le temps de voyage original en tooltip
                        const destinations = ['MOON', 'MARS', 'EUROPA', 'TITAN'];
                        const travelTimes = ['3 DAYS', '9 MONTHS', '3 YEARS', '7 YEARS'];
                        const index = data.columns[0].indexOf(v);
                        if (index > 0 && destinations[index - 1]) {
                            return travelTimes[index - 1];
                        }
                        return v;
                    }
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: data.columns[1].slice(1), // Noms des destinations
                    tick: {
                        text: {
                            fill: 'white',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    label: {
                        text: 'Destinations',
                        position: 'outer-center',
                        text: {
                            fill: 'white',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
                y: {
                    label: {
                        text: 'Temps de Voyage (jours)',
                        position: 'outer-middle',
                        text: {
                            fill: 'white',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tick: {
                        text: {
                            fill: 'white'
                        },
                        format: function (d) {
                            return d + 'j';
                        }
                    },
                    min: 0,
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.6  // Largeur des barres (60% de l'espace disponible)
                }
            },
            grid: {
                y: {
                    show: false
                }
            },
            tooltip: {
                format: {
                    title: function (d) {
                        return 'Destination: ' + d;
                    },
                    value: function (value, ratio, id) {
                        // Convertir les jours en format lisible
                        if (value <= 30) {
                            return value + ' jours';
                        } else if (value <= 365) {
                            return Math.round(value / 30) + ' mois';
                        } else {
                            return Math.round(value / 365) + ' ans';
                        }
                    }
                }
            },
            legend: {
                show: false  // Cacher la légende (une seule série de données)
            },
            padding: {
                top: 20,
                right: 30,
                bottom: 40,
                left: 60
            },
            onrendered: function () {
                // Appliquer des styles supplémentaires après le rendu
                if (typeof d3 !== 'undefined') {
                    const svg = d3.select(`#${containerId} svg`);
                    svg.style('background', 'transparent');
                    
                    // Forcer la couleur bleue pour tous les textes
                    svg.selectAll('text')
                        .style('fill', '#4EA8DE')
                        .style('stroke', 'none');
                    
                    // Centrer les textes de l'axe X sous les barres
                    svg.selectAll('.c3-axis-x .tick text')
                        .style('text-anchor', 'middle')
                        .attr('x', 0);  // Réinitialiser la position X
                    
                    // Style des axes
                    svg.selectAll('.domain')
                        .style('stroke', 'rgba(78, 168, 222, 0.3)');
                    
                    svg.selectAll('.tick line')
                        .style('stroke', 'rgba(78, 168, 222, 0.3)');
                }
            }
        });
    }

    /*
     * MÉTHODE: renderD3Chart()
     * DESCRIPTION: Alternative avec D3.js pur pour plus de personnalisation
     * PARAMÈTRE: containerId - ID de l'élément conteneur
     * PARAMÈTRE: data - données au format D3
     * 
     * Cette méthode utilise D3.js directement pour créer un diagramme personnalisé
     */
    renderD3Chart(containerId, data) {
        if (!data || !Array.isArray(data)) {
            console.error('Données invalides pour le diagramme D3');
            return;
        }

        // Nettoyer le conteneur
        const container = d3.select(`#${containerId}`);
        container.selectAll('*').remove();

        // Dimensions du diagramme
        const margin = {top: 40, right: 30, bottom: 60, left: 80};
        const width = 700 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Créer le SVG
        const svg = container
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Échelles
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.name))
            .padding(0.3);

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d => d.value)]);

        // Axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', 'white')
            .style('font-weight', 'bold');

        svg.append('g')
            .call(d3.axisLeft(y).tickFormat(d => d + 'j'))
            .selectAll('text')
            .style('fill', 'white');

        // Barres
        svg.selectAll('bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => x(d.name))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', '#4EA8DE')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', '#6BB6E8');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', '#4EA8DE');
            })
            .transition()
            .duration(800)
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value));

        // Labels sur les barres
        svg.selectAll('text.label')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => x(d.name) + x.bandwidth() / 2)
            .attr('y', d => y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d => d.textValue);

        // Titre
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Temps de Voyage par Destination');
    }

    /*
     * MÉTHODE: destroy()
     * DESCRIPTION: Détruit le diagramme actuel et nettoie les ressources
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    /*
     * MÉTHODE: resize()
     * DESCRIPTION: Redimensionne le diagramme (utile pour le responsive)
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
}