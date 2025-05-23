document.addEventListener('DOMContentLoaded', () => {
    // --- Data (Simulated Backend) ---
    const menuItems = [
        {
            id: 'dosa',
            name: 'Masala Dosa',
            category: 'main-course',
            description: 'Crispy rice pancake with a savory potato filling, served with sambar and chutneys.',
            price: 12.99,
            image: 'https://img.freepik.com/premium-photo/masala-dosa-is-south-indian-meal-served-with-sambhar-coconut-chutney-selective-focus_466689-22969.jpg?w=1380'
        },
        {
            id: 'biryani',
            name: 'Chicken Biryani',
            category: 'main-course',
            description: 'Fragrant basmati rice cooked with tender chicken, exotic spices, and herbs.',
            price: 18.50,
            image: 'https://img.freepik.com/premium-photo/chicken-biryani_948735-11965.jpg'
        },
        {
            id: 'samosa',
            name: 'Veg Samosa',
            category: 'starters',
            description: 'Crispy pastry filled with spiced potatoes and peas, deep-fried to perfection.',
            price: 6.00,
            image: 'https://kerala.me/wp-content/uploads/2016/04/samosa-1200x808.jpg'
        },
        {
            id: 'paneer-tikka',
            name: 'Paneer Tikka',
            category: 'starters',
            description: 'Marinated cottage cheese cubes grilled with bell peppers and onions.',
            price: 14.00,
            image: 'https://img.freepik.com/premium-photo/platter-paneer-tikka-surrounded-by-fresh-mint-lea_1196052-454.jpg'
        },
        {
            id: 'gulab-jamun',
            name: 'Gulab Jamun',
            category: 'desserts',
            description: 'Soft, melt-in-your-mouth milk solids dumplings soaked in rose-flavored sugar syrup.',
            price: 5.50,
            image: 'https://wallpapercave.com/wp/wp2157277.jpg'
        },
        {
            id: 'lassi',
            name: 'Mango Lassi',
            category: 'beverages',
            description: 'A refreshing blend of sweet mango pulp and creamy yogurt.',
            price: 4.50,
            image: 'https://www.ruchiskitchen.com/wp-content/uploads/2015/05/mango-lassi-recipe-6.jpg'
        },
        // Add more menu items here
    ];

    let cart = JSON.parse(localStorage.getItem('hotelCart')) || []; // Load cart from local storage

    // --- DOM Elements ---
    const menuItemsContainer = document.getElementById('menu-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const menuCategoryButtons = document.querySelectorAll('.category-btn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const tableBookingForm = document.getElementById('table-booking-form');
    const bookingMessage = document.getElementById('booking-message');

    // --- Functions ---

    // Toggle Mobile Navigation
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Render Menu Items
    const renderMenuItems = (category = 'all') => {
        menuItemsContainer.innerHTML = ''; // Clear previous items
        const filteredItems = category === 'all'
            ? menuItems
            : menuItems.filter(item => item.category === category);

        if (filteredItems.length === 0) {
            menuItemsContainer.innerHTML = '<p style="text-align: center; width: 100%; color: #666;">No items found in this category.</p>';
            return;
        }

        filteredItems.forEach(item => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <button class="btn add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemDiv);
        });
    };

    // Update Cart Count in Navbar
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    };

    // Add to Cart
    const addToCart = (itemId) => {
        const existingItem = cart.find(item => item.id === itemId);
        const menuItem = menuItems.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...menuItem, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCartItems(); // Re-render cart content when adding
        alert(`${menuItem.name} added to cart!`); // Simple feedback
    };

    // Remove from Cart
    const removeFromCart = (itemId) => {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        updateCartCount();
        renderCartItems();
    };

    // Update Quantity in Cart
    const updateCartQuantity = (itemId, change) => {
        const itemToUpdate = cart.find(item => item.id === itemId);
        if (itemToUpdate) {
            itemToUpdate.quantity += change;
            if (itemToUpdate.quantity <= 0) {
                removeFromCart(itemId);
            } else {
                saveCart();
                renderCartItems();
            }
        }
    };

    // Save Cart to Local Storage
    const saveCart = () => {
        localStorage.setItem('hotelCart', JSON.stringify(cart));
    };

    // Render Cart Items in Modal
    const renderCartItems = () => {
        cartItemsDiv.innerHTML = ''; // Clear previous items
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            cartTotalSpan.textContent = '$0.00';
            checkoutBtn.disabled = true;
            clearCartBtn.disabled = true;
            return;
        }

        let total = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            const itemPrice = item.price * item.quantity;
            total += itemPrice;

            cartItemDiv.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Price: $${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-item btn" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        });

        cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
        clearCartBtn.disabled = false;
    };

    // Clear Cart
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    });

    // Checkout (Placeholder - would involve backend)
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout! (This would be a backend process)');
            // In a real application, you'd send the cart data to a server
            // for payment processing and order creation.
            cart = []; // Clear cart after "checkout"
            saveCart();
            updateCartCount();
            renderCartItems();
            cartModal.style.display = 'none'; // Close modal
        } else {
            alert('Your cart is empty!');
        }
    });

    // Table Booking Form Submission
    tableBookingForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(tableBookingForm);
        const bookingDetails = Object.fromEntries(formData.entries());

        // Basic validation (more robust validation needed)
        if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.guests || !bookingDetails.date || !bookingDetails.time) {
            bookingMessage.textContent = 'Please fill in all required fields.';
            bookingMessage.style.color = 'red';
            return;
        }

        // Simulate sending data to a backend
        console.log('Booking Details:', bookingDetails);

        // In a real application, you'd send this data to a server
        // fetch('/api/book-table', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(bookingDetails)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     if (data.success) {
        //         bookingMessage.textContent = 'Table booked successfully! Confirmation sent to your email.';
        //         bookingMessage.style.color = 'green';
        //         tableBookingForm.reset();
        //     } else {
        //         bookingMessage.textContent = data.message || 'Error booking table. Please try again.';
        //         bookingMessage.style.color = 'red';
        //     }
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        //     bookingMessage.textContent = 'An error occurred. Please try again later.';
        //     bookingMessage.style.color = 'red';
        // });

        bookingMessage.textContent = 'Table booked successfully! We will confirm via email.';
        bookingMessage.style.color = 'green';
        tableBookingForm.reset();
        setTimeout(() => {
            bookingMessage.textContent = ''; // Clear message after a few seconds
        }, 5000);
    });


    // --- Event Listeners ---

    // Delegate click events for "Add to Cart" buttons
    menuItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const itemId = e.target.dataset.id;
            addToCart(itemId);
        }
    });

    // Open Cart Modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCartItems();
    });

    // Close Cart Modal
    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close Modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Delegate click events for cart item quantity and remove buttons
    cartItemsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('decrease')) {
            const itemId = e.target.dataset.id;
            updateCartQuantity(itemId, -1);
        } else if (e.target.classList.contains('increase')) {
            const itemId = e.target.dataset.id;
            updateCartQuantity(itemId, 1);
        } else if (e.target.classList.contains('remove-item')) {
            const itemId = e.target.dataset.id;
            removeFromCart(itemId);
        }
    });

    // Menu Category Filtering
    menuCategoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            menuCategoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderMenuItems(button.dataset.category);
        });
    });

    // --- Initial Load ---
    renderMenuItems(); // Render all menu items initially
    updateCartCount(); // Initialize cart count on page load
});