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
            </nav>
            
            <!-- ✅ NUEVO: Nombre del usuario y perfil -->
            <div class="header-actions">
                <div class="user-greeting">
                    <span class="greeting-text">Hola, {{ nombreUsuario }}</span>
                    <router-link to="/cliente/perfil" class="user-avatar">
                        {{ primeraLetra }}
                    </router-link>
                </div>
            </div>
        </div>
        
        <!-- Barra de búsqueda -->
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
            searchQuery: '',
            nombreUsuario: '' // ✅ NUEVO
        }
    },
    computed: {
        // ✅ NUEVO: Primera letra para el avatar
        primeraLetra() {
            return this.nombreUsuario ? this.nombreUsuario.charAt(0).toUpperCase() : 'U';
        }
    },
    mounted() {
        // ✅ NUEVO: Cargar nombre del usuario
        this.nombreUsuario = localStorage.getItem('nombre') || 'Usuario';
    },
    methods: {
        toggleSearch() {
            this.showSearch = !this.showSearch;
        },
        handleSearch() {
            if (this.searchQuery.trim()) {
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
    color: #8B5FBF;
    background: rgba(139, 95, 191, 0.1);
}

.nav-link.router-link-active {
    color: #8B5FBF;
    font-weight: 600;
    background: rgba(139, 95, 191, 0.15);
}

.search-btn {
    color: #666;
}

/* ✅ NUEVO: Saludo y avatar del usuario */
.header-actions {
    grid-column: 3;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.user-greeting {
    display: flex;
    align-items: center;
    gap: 12px;
}

.greeting-text {
    font-size: 0.95rem;
    color: #333;
    font-weight: 500;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8B5FBF, #CAA6F7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
}

.user-avatar:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(139, 95, 191, 0.3);
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
    border-color: #8B5FBF;
}

.search-submit {
    padding: 0.75rem 1.5rem;
    background: #8B5FBF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s ease;
}

.search-submit:hover {
    background: #CAA6F7;
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
    
    .nav-links {
        display: none;
    }
    
    .greeting-text {
        display: none;
    }
}
</style>