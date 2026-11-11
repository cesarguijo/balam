/**
 * @file Pantalla de bienvenida: por ahora solo muestra un mensaje corto de bienvenida.
 */

import '../../componentes/boton/boton.js';

/**
 * Muestra la pantalla de bienvenida dentro del contenedor.
 * @param {HTMLElement} app - Contenedor donde se dibuja la pantalla.
 */
export function mostrarBienvenida(app) {
  app.innerHTML = /* html */ `
    <div class="bienvenida">
    <div class="bienvenida__contenido">
      <header class="identidad">
          <div class="identidad__logo">
            <img src="/img/icon-192.png" alt="Logo de Balam">
          </div>
          <h1 class="identidad__nombre titulo-marca">Balam</h1>
          <p class="identidad__lema titulo-grande">La app de la clase del Prof. César</p>
      </header>
      <ul class="caracteristicas">
        <li class="caracteristicas__item">
          <div class="caracteristicas__icono" aria-hidden="true">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_232_25)">
                <path d="M15.7737 21.4855C14.9506 21.4204 14.1051 21.3865 13.2425 21.3865H10.2028V21.3855C9.89102 21.3857 9.58066 21.3646 9.27263 21.3272L12.1737 29.6375C12.3209 30.0485 12.6091 30.3947 12.9862 30.6146C13.3634 30.8344 13.8061 30.9141 14.2362 30.8396C14.6662 30.765 15.0561 30.541 15.3373 30.2073C15.6184 29.8735 15.7733 29.451 15.7737 29.0146V21.4855ZM27.3885 4.42213C26.1035 5.3257 24.5315 6.08193 22.778 6.6669C21.292 7.16258 19.6523 7.54253 17.9071 7.78876V19.5751C19.6526 19.8213 21.292 20.2023 22.778 20.698C24.5313 21.2829 26.1037 22.0383 27.3885 22.9417V4.42213ZM15.7737 8.01793C14.9465 8.07921 14.1012 8.11168 13.2425 8.11168H10.2028C8.91845 8.11224 7.67339 8.55615 6.67885 9.36896C5.68438 10.1817 5.00182 11.3135 4.7455 12.572C4.48926 13.8308 4.67488 15.1402 5.27259 16.2772C5.86996 17.4136 6.84215 18.3076 8.0247 18.8105H8.02366C8.71386 19.103 9.45486 19.2539 10.2018 19.2532H13.2425C14.1012 19.2532 14.9466 19.2847 15.7737 19.3459V8.01793ZM32.3666 13.6825C32.3666 12.6451 31.9543 11.6504 31.2208 10.9169C30.7446 10.4407 30.1584 10.1005 29.5218 9.91999V17.4439C30.1583 17.2634 30.7447 16.9241 31.2208 16.448C31.9543 15.7145 32.3666 14.7198 32.3666 13.6825ZM34.5 13.6825C34.5 15.2856 33.8627 16.8228 32.7291 17.9564C31.8503 18.8352 30.7286 19.4128 29.5218 19.6293V25.298C29.5218 25.7425 29.2463 26.1407 28.8301 26.2969C28.414 26.453 27.9445 26.3347 27.652 26C26.541 24.7284 24.6323 23.5657 22.103 22.7219C20.8295 22.2971 19.4187 21.9596 17.9071 21.7303V29.0156C17.9064 29.9544 17.5743 30.8631 16.9696 31.5812C16.3647 32.2994 15.5249 32.7813 14.5998 32.9416C13.6748 33.1017 12.7233 32.9299 11.9122 32.4573C11.1012 31.9845 10.4829 31.241 10.1664 30.3573L10.1633 30.3489L6.74864 20.5678C5.31453 19.8481 4.13604 18.6983 3.38506 17.2699C2.55855 15.6976 2.30052 13.8877 2.65485 12.1471C3.00915 10.4066 3.95361 8.842 5.32884 7.71793C6.70425 6.59384 8.42652 5.97904 10.2028 5.97837H13.2425C14.4417 5.97837 15.6077 5.9116 16.7269 5.78774C16.7293 5.78749 16.7317 5.78694 16.7342 5.7867C18.6912 5.56963 20.5055 5.17584 22.103 4.64296C24.6324 3.79917 26.5411 2.63636 27.652 1.36487C27.9445 1.03024 28.414 0.911885 28.8301 1.068C29.2463 1.2242 29.5218 1.62242 29.5218 2.06695V7.7346C30.7286 7.951 31.8503 8.52966 32.7291 9.40854C33.8627 10.5421 34.5 12.0793 34.5 13.6825Z" fill="#7A4E32"/>
              </g>
              <defs>
                <filter id="filter0_d_232_25" x="-0.5" y="-1" width="38" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="1"/>
                  <feGaussianBlur stdDeviation="1.5"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.647059 0 0 0 0 0.529412 0 0 0 0 0.4 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_232_25"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_232_25" result="shape"/>
                </filter>
              </defs>
            </svg>

          </div>
           <p class="cuerpo-grande">Aviso y notas en tu celular</p>
        </li>
        <li class="caracteristicas__item">
          <div class="caracteristicas__icono">
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_232_33)">
<path d="M22.642 0C23.9438 0 24.9988 1.04807 24.9988 2.34126V10.7744C24.9988 10.7784 25 10.7825 25 10.7865C25 10.7904 24.9988 10.7948 24.9988 10.7987V29.6587C24.9985 30.9517 23.9436 32 22.642 32H5.35679C4.05548 31.9997 3.00031 30.9515 3 29.6587V2.34126C3 1.04826 4.05529 0.000314853 5.35679 0H22.642ZM4.5716 29.6587C4.57191 30.0893 4.92333 30.4384 5.35679 30.4388H22.642C23.0757 30.4388 23.4281 30.0895 23.4284 29.6587V11.5666H4.5716V29.6587ZM9.19713 24.3785C10.0646 24.3787 10.7672 25.0768 10.7675 25.9385V28.7111C10.7669 29.5725 10.0644 30.2708 9.19713 30.2711H6.40616C5.5391 30.2706 4.83638 29.5724 4.83578 28.7111V25.9385C4.83605 25.0769 5.5389 24.379 6.40616 24.3785H9.19713ZM15.3955 24.3785C16.2627 24.379 16.9656 25.0769 16.9659 25.9385V28.7111C16.9653 29.5724 16.2625 30.2706 15.3955 30.2711H12.6045C11.7373 30.2708 11.0347 29.5725 11.0341 28.7111V25.9385C11.0344 25.0768 11.7371 24.3787 12.6045 24.3785H15.3955ZM21.5926 24.3785C22.46 24.3788 23.1627 25.0768 23.163 25.9385V28.7111C23.1624 29.5725 22.4598 30.2708 21.5926 30.2711H18.8016C17.9344 30.2708 17.2319 29.5725 17.2313 28.7111V25.9385C17.2315 25.0768 17.9342 24.3787 18.8016 24.3785H21.5926ZM6.40616 28.7111H9.19713V25.9385H6.40616V28.7111ZM12.6045 28.7111H15.3955V25.9385H12.6045V28.7111ZM18.8016 28.7111H21.5926V25.9385H18.8016V28.7111ZM9.19713 18.057C10.0645 18.0572 10.7671 18.7554 10.7675 19.617V22.3896C10.7672 23.2513 10.0646 23.9493 9.19713 23.9496H6.40616C5.5389 23.9491 4.83605 23.2512 4.83578 22.3896V19.617C4.83623 18.7555 5.53901 18.0574 6.40616 18.057H9.19713ZM15.3955 18.057C16.2626 18.0575 16.9654 18.7556 16.9659 19.617V22.3896C16.9656 23.2511 16.2627 23.9491 15.3955 23.9496H12.6045C11.7371 23.9493 11.0344 23.2513 11.0341 22.3896V19.617C11.0346 18.7554 11.7372 18.0572 12.6045 18.057H15.3955ZM21.5926 18.057C22.4599 18.0572 23.1625 18.7554 23.163 19.617V22.3896C23.1627 23.2513 22.46 23.9493 21.5926 23.9496H18.8016C17.9342 23.9493 17.2315 23.2513 17.2313 22.3896V19.617C17.2317 18.7554 17.9343 18.0572 18.8016 18.057H21.5926ZM6.40616 22.3896H9.19713V19.617H6.40616V22.3896ZM12.6045 22.3896H15.3955V19.617H12.6045V22.3896ZM18.8016 22.3896H21.5926V19.617H18.8016V22.3896ZM9.19713 11.7354C10.0644 11.7357 10.767 12.434 10.7675 13.2955V16.068C10.7672 16.9298 10.0646 17.6278 9.19713 17.6281H6.40616C5.5389 17.6276 4.83605 16.9296 4.83578 16.068V13.2955C4.83632 12.4341 5.53906 11.7359 6.40616 11.7354H9.19713ZM15.3955 11.7354C16.2626 11.7359 16.9653 12.4341 16.9659 13.2955V16.068C16.9656 16.9296 16.2627 17.6276 15.3955 17.6281H12.6045C11.7371 17.6278 11.0344 16.9298 11.0341 16.068V13.2955C11.0347 12.434 11.7372 11.7357 12.6045 11.7354H15.3955ZM21.5926 11.7354C22.4599 11.7357 23.1625 12.434 23.163 13.2955V16.068C23.1627 16.9298 22.46 17.6278 21.5926 17.6281H18.8016C17.9342 17.6278 17.2315 16.9298 17.2313 16.068V13.2955C17.2318 12.434 17.9344 11.7357 18.8016 11.7354H21.5926ZM6.40616 16.068H9.19713V13.2955H6.40616V16.068ZM12.6045 16.068H15.3955V13.2955H12.6045V16.068ZM18.8016 16.068H21.5926V13.2955H18.8016V16.068ZM5.35679 1.56003C4.92314 1.56034 4.5716 1.91039 4.5716 2.34126V10.0065H23.4284V2.34126C23.4284 1.91019 23.0759 1.56003 22.642 1.56003H5.35679Z" fill="#7A4E32"/>
</g>
<defs>
<filter id="filter0_d_232_33" x="0" y="-2" width="28" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="1.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.647059 0 0 0 0 0.529412 0 0 0 0 0.4 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_232_33"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_232_33" result="shape"/>
</filter>
</defs>
</svg>

          </div>
          <p class="cuerpo-grande">Matemáticas a tu ritmo</p>
        </li>
        <li class="caracteristicas__item">
          <div class="caracteristicas__icono">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_232_35)">
<path d="M6.36842 13.7896H29.9474C31.8077 13.7896 33.3158 15.2976 33.3158 17.158V30.6317C33.3158 32.492 31.8077 34.0001 29.9474 34.0001H6.36842C4.50809 34.0001 3 32.492 3 30.6317V17.158C3 15.2976 4.50809 13.7896 6.36842 13.7896Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="#7A4E32"/>
<path d="M8.05263 7.05263C8.05263 5.71259 8.58496 4.42743 9.53251 3.47988C10.4801 2.53233 11.7652 2 13.1053 2H23.2105C24.5506 2 25.8357 2.53233 26.7833 3.47988C27.7308 4.42743 28.2631 5.71259 28.2631 7.05263V13.7895H8.05263V7.05263Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="#7A4E32"/>
</g>
<defs>
<filter id="filter0_d_232_35" x="-5" y="-5" width="48.3158" height="50" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="2"/>
<feGaussianBlur stdDeviation="4"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.647059 0 0 0 0 0.529412 0 0 0 0 0.4 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_232_35"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_232_35" result="shape"/>
</filter>
</defs>
</svg>

          </div>
          <p class="cuerpo-grande">Privado gratis y sin anuncios</p>  
        </li>
      </ul>
      <footer class="pie-instalacion">
        <balam-boton texto="Instalar"></balam-boton>
        <p class="etiqueta-pequena">Consume pocos datos y almacenamiento</p>
    </footer>
    </div>
    
  `;
}
