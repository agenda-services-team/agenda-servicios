<template>
    <div>
        <main class="main-content">
            <h2 class="titulo-bienvenida">Bienvenido a OaxacaGlow</h2>
            <p class="descripcion-home">
                El sitio perfecto donde puedes explorar los diversos<br>
                servicios estéticos que Oaxaca tiene para ofrecer.<br>
                ¡Embellece tu vida con nosotros!
            </p>
            <div class="opciones-container">
                <div class="opcion">
                    <div class="img-container">
                        <img src="/src/images/imagenProv.png" alt="Opción 1" class="img-opcion" />
                        <router-link to="/ruta1">
                            <button class="btn-opcion">Puedes unirte como proveedor y ofrecer tus servicios</button>
                        </router-link>
                    </div>
                </div>
                <div class="opcion">
                    <div class="img-container">
                        <img src="/src/images/imagenCli.jpg" alt="Opción 2" class="img-opcion" />
                        <router-link to="/ruta2">
                            <button class="btn-opcion">Unete para explorar y agenda citas en cuestion de minutos para
                                servicios esteticos</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </main>

    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
    name: "Home",
    components: { Navbar, Footer }
}
</script>

<style scoped>
.main-content {
    padding: 0;
    text-align: center;
    background-image: url("/src/images/fondoInicio.png");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    width: 80vw;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding-top: 60px;
}

.main-content::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.6);
    /*un blanco semitranparente*/
    z-index: 1;
}

.main-content>* {
    position: relative;
    z-index: 2;
}

.opciones-container {
    display: flex;
    justify-content: center;
    gap: 60px;
    margin-top: 40px;
}

.opcion {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 460px;
    min-height: 300px;
}

.img-container {
    position: relative;
    width: 460px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.img-opcion {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
}

.btn-opcion {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 0;
    width: 200px;
    font-size: 1.15rem;
    border: none;
    border-radius: 8px;
    background: rgba(255, 247, 247, 0.8);
    color: #111;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    letter-spacing: 1px;
    margin: 0;
    display: block;
    z-index: 2;
}

.btn-opcion:hover {
    background: rgba(243, 214, 224, 0.9);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
    color: #111;
}

.titulo-bienvenida {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 30px;
}

.descripcion-home {
    font-size: 1.3rem;
    line-height: 2.2rem;
    max-width: 600px;
}
</style>
