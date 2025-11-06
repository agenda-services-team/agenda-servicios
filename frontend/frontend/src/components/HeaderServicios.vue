<template>
    <header class="header-servicios">
        <div class="header-container">
            <!-- Logo a la izquierda -->
            <div class="logo">
                <router-link to="/servicios">
                    <img :src="logoUrl" alt="OaxacaGlow Logo" class="logo-img" />
                </router-link>
            </div>
            
            <!-- Navegación central -->
            <nav class="nav-links">
                <router-link to="/servicios" class="nav-link">
                    Home
                </router-link>
                <router-link to="/cliente/mis-citas" class="nav-link">
                    Mis Citas
                </router-link>
                <button @click="toggleSearch" class="nav-link search-btn">
                    Buscar
                </button>
                <router-link to="/cliente/perfil" class="nav-link">
                    Mi Perfil
                </router-link>
            </nav>
            
            <!-- Acciones a la derecha (futuro: notificaciones, avatar) -->
            <div class="header-actions">
                <!-- Icono de búsqueda móvil -->
                <button @click="toggleSearch" class="mobile-search-btn">
                    🔍
                </button>
            </div>
        </div>
        
        <!-- Barra de búsqueda (aparece al hacer click en "Buscar") -->
        <div v-if="showSearch" class="search-bar">
            <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Buscar servicios..."
                class="search-input"
                @keyup.enter="handleSearch"
            />
            <button @click="handleSearch" class="search-submit">
                Buscar
            </button>
            <button @click="toggleSearch" class="search-close">
                ✕
            </button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderServicios',
    data() {
        return {
            logoUrl: new URL('../images/logo.png', import.meta.url).href,
            showSearch: false,
            searchQuery: ''
        }
    },
    methods: {
        toggleSearch() {
            this.showSearch = !this.showSearch;
        },
        handleSearch() {
            if (this.searchQuery.trim()) {
                // Emitir evento o usar event bus para filtrar servicios
                this.$emit('search', this.searchQuery);
                console.log('Buscando:', this.searchQuery);
            }
        }
    }
}
</script>

<style scoped>
.header-servicios {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 100%;
}

/* Logo */
.logo {
    grid-column: 1;
    display: flex;
    align-items: center;
}

.logo a {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.logo-img {
    height: 50px;
    width: auto;
    object-fit: contain;
    cursor: pointer;
}

.logo a:hover .logo-img {
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

/* Navegación */
.nav-links {
    grid-column: 2;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    background: none;
    border: none;
    cursor: pointer;
}

.nav-link:hover {
    color: #791236;
    background: rgba(121, 18, 54, 0.1);
}

.nav-link.router-link-active {
    color: #791236;
    font-weight: 600;
    background: rgba(121, 18, 54, 0.15);
}

.search-btn {
    color: #666;
}

/* Acciones derecha */
.header-actions {
    grid-column: 3;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.mobile-search-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

/* Barra de búsqueda */
.search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: #f9f9f9;
    border-top: 1px solid #e0e0e0;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.search-input:focus {
    outline: none;
    border-color: #791236;
}

.search-submit {
    padding: 0.75rem 1.5rem;
    background: #791236;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s ease;
}

.search-submit:hover {
    background: #a01648;
}

.search-close {
    padding: 0.5rem 1rem;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
    .header-container {
        grid-template-columns: auto 1fr auto;
        padding: 0.75rem 1rem;
    }
    
    .logo-img {
        height: 40px;
    }
    
    /* Ocultar navegación en móvil */
    .nav-links {
        display: none;
    }
    
    /* Mostrar botón de búsqueda móvil */
    .mobile-search-btn {
        display: block;
    }
    
    /* Menú hamburguesa (implementar después) */
}

@media (max-width: 480px) {
    .logo-img {
        height: 35px;
    }
    
    .search-bar {
        padding: 0.75rem 1rem;
    }
    
    .search-input {
        font-size: 0.9rem;
    }
}
</style>