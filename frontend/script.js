
        // Clothing database - manually curated matches
        const clothingDatabase = [
            // Blue Denim Jacket
            {
                id: 1,
                name: "Blue Denim Jacket",
                category: "shirts",
                img: "Images/Shirts/1.png",
                matches: [1, 12, 8, 10] // matches with white shirt, black pants, etc.
            },
            // White Oxford Shirt
            {
                id: 2,
                name: "White Oxford Shirt",
                category: "shirts",
                img: "Images/Shirts/2.png",
                matches: [2, 10, 12] // matches with jackets, sweaters, etc.
            },
            // Black Slim Fit Pants
            {
                id: 3,
                name: "Black Slim Fit Pants",
                category: "shirts",
                img: "Images/Shirts/3.png",
                matches: [3, 10, 12] // matches with jackets, shirts, etc.
            },
            // Gray Cashmere Sweater
            {
                id: 4,
                name: "Gray Cashmere Sweater",
                category: "shirts",
                img: "Images/Shirts/4.png",
                matches: [4, 9, 11, 12] // matches with shirts, pants, etc.
            },
            // Tan Chinos
            {
                id: 5,
                name: "Tan Chinos",
                category: "shirts",
                img: "Images/Shirts/5.png",
                matches: [5, 10, 12] // matches with shirts, sweaters, etc.
            },
            // Navy Blue Blazer
            {
                id: 6,
                name: "Navy Blue Blazer",
                category: "shirts",
                img: "Images/Shirts/6.png",
                matches: [6, 9, 10, 11, 12] // matches with shirts, pants, etc.
            },
            // Striped Button-Down Shirt
            {
                id: 7,
                name: "Striped Button-Down Shirt",
                category: "shirts",
                img: "Images/Shirts/7.png",
                matches: [7, 10, 12] // matches with jackets, pants, etc.
            },
            // Dark Wash Jeans
            {
                id: 8,
                name: "Dark Wash Jeans",
                category: "pants",
                img: "Images/Suri/1.png",
                matches: [8, 1, 4, 5, 7] // matches with jackets, shirts, etc.
            },
            // Cream Cable Knit Sweater
            {
                id: 9,
                name: "Cream Cable Knit Sweater",
                category: "pants",
                img: "Images/Suri/2.png",
                matches: [9,4,2,3,5,6,7] // matches with shirts, pants, etc.
            },
            // White T-Shirt
            {
                id: 10,
                name: "White T-Shirt",
                category: "pants",
                img: "Images/Suri/3.png",
                matches: [10, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 11,
                name: "White T-Shirt",
                category: "pants",
                img: "Images/Suri/4.png",
                matches: [11, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 12,
                name: "White T-Shirt",
                category: "pants",
                img: "Images/Suri/5.png",
                matches: [12, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 13,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/1.png",
                matches: [13, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 14,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/2.png",
                matches: [14, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 15,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/3.png",
                matches: [15, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 16,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/4.png",
                matches: [16, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 17,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/5.png",
                matches: [17, 1, 3, 4, 8] // matches with jackets, pants, etc.
            },
            {
                id: 18,
                name: "White T-Shirt",
                category: "sweaters",
                img: "Images/Sweaters/6.png",
                matches: [18, 1, 3, 4, 8] // matches with jackets, pants, etc.
            }
        ];

        // DOM Elements
        const navLinks = document.querySelectorAll('.nav a');
        const button = document.querySelector('.signUp');
        const clothingGrid = document.getElementById('clothingGrid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const matchingSection = document.getElementById('matchingSection');
        const matchingItems = document.getElementById('matchingItems');


        // Function to render clothing items
        function renderClothingItems(category = 'all') {
            clothingGrid.innerHTML = '';
            
            const filteredItems = category === 'all' 
                ? clothingDatabase 
                : clothingDatabase.filter(item => item.category === category);
            
            filteredItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'clothing-item';
                itemElement.dataset.id = item.id;
                
                itemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" />
                    <div class="clothing-info">
                        <h3>${item.name}</h3>
                        <p>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
                    </div>
                `;
                
                itemElement.addEventListener('click', () => showMatches(item));
                clothingGrid.appendChild(itemElement);
            });
        }

        // Function to show matching items
        function showMatches(selectedItem) {
            matchingSection.style.display = 'block';    
            matchingItems.innerHTML = '';
            
            // Find matching items
            const matches = selectedItem.matches.map(matchId => 
                clothingDatabase.find(item => item.id === matchId)
            );
            
            matches.forEach(match => {
                const matchElement = document.createElement('div');
                matchElement.className = 'clothing-item';
                
                matchElement.innerHTML = `
                    <img src="${match.img}" alt="${match.name}" />
                    <div class="clothing-info">
                        <h3>${match.name}</h3>
                        <p>${match.category.charAt(0).toUpperCase() + match.category.slice(1)}</p>
                    </div>
                `;
                
                matchingItems.appendChild(matchElement); 
                matchElement.addEventListener('click', () => showMatches(match));
            });            
            // Scroll to matching section
            matchingSection.scrollIntoView({ behavior: 'smooth' });
           
        }

        // Event listener for filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderClothingItems(button.dataset.category);
                matchingSection.style.display = 'none'; // Hide matching section on filter change
            });
        });
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                const targetId = this.getAttribute('href').replace('#', '');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    if(targetId !== 'home'){
                        targetSection.style.marginTop = '150px';
                    }
                }

            });
        });
        button.addEventListener('click', () => {
            const destination = document.getElementById('closet')
            if (destination) {
                    destination.scrollIntoView({ behavior: 'smooth' });
                }
            destination.scrollIntoView({ behavior: 'smooth' });
            
            destination.style.marginTop = '150px';
            let startY = null;
            destination.addEventListener('mousedown', function(e) {                
                startY = e.clientY;
                });

                destination.addEventListener('mouseup', function(e) {
                if (startY !== null) {
                    const endY = e.clientY;
                    if (endY < startY) {
                    // Mouse moved up
                    destination.style.marginTop = '40px';
                    } else {
                    // Mouse moved down or stayed
                    destination.style.marginTop = '150px';
                    }
                    startY = null; // Reset
                }
                });

        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', () => {
            renderClothingItems();

        });