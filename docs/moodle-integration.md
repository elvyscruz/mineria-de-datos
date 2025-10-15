# 🎓 Guía de Integración con Moodle

Esta guía explica cómo integrar el sitio web educativo de Minería de Datos con la plataforma Moodle LMS (Learning Management System).

## 📋 Requisitos Previos

### Moodle
- **Versión**: Moodle 3.9 o superior
- **Permisos**: Administrador del curso o rol con capacidades de edición
- **Plugins**: SCORM module (generalmente incluido por defecto)

### Contenido del Sitio Web
- **Archivos**: Todo el contenido del sitio web
- **Estructura**: Mantener la jerarquía de carpetas original
- **Recursos**: Videos, imágenes y otros archivos multimedia

## 🚀 Métodos de Integración

### Método 1: iFrame (Recomendado)

**Ventajas:**
- Fácil implementación
- Mantiene el diseño original
- No requiere configuración compleja

**Pasos:**

1. **Subir archivos al servidor**:
   ```bash
   # Subir todos los archivos a un servidor web accesible
   # Ejemplo: https://tuuniversidad.edu/cursos/mineria-datos/
   ```

2. **Crear actividad en Moodle**:
   - Iniciar sesión en Moodle
   - Entrar al curso
   - Activar edición
   - Añadir actividad → "Página"

3. **Configurar la página**:
   ```html
   <iframe
       src="https://tuuniversidad.edu/cursos/mineria-datos/index.html"
       width="100%"
       height="800px"
       frameborder="0"
       allowfullscreen>
   </iframe>
   ```

4. **Configuración avanzada del iframe**:
   ```html
   <iframe
       src="https://tuuniversidad.edu/cursos/mineria-datos/index.html"
       width="100%"
       height="800px"
       frameborder="0"
       scrolling="yes"
       allowfullscreen
       style="border: 1px solid #ddd; border-radius: 8px;">
   </iframe>
   ```

### Método 2: SCORM Package

**Ventajas:**
- Integración nativa con Moodle
- Seguimiento de progreso
- Calificaciones automáticas

**Pasos:**

1. **Crear estructura SCORM**:
   ```xml
   <!-- imsmanifest.xml -->
   <?xml version="1.0" encoding="UTF-8"?>
   <manifest identifier="com.mineria-datos.course"
             version="1.0"
             xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
             xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd">

     <organizations>
       <organization identifier="org-1">
         <title>Minería de Datos</title>
         <item identifier="item-1">
           <title>Curso Completo</title>
           <resource identifier="res-1" type="webcontent" href="index.html"/>
         </item>
       </organization>
     </organizations>

     <resources>
       <resource identifier="res-1" type="webcontent" href="index.html">
         <file href="index.html"/>
         <file href="css/styles.css"/>
         <file href="js/main.js"/>
         <!-- Agregar todos los archivos necesarios -->
       </resource>
     </resources>
   </manifest>
   ```

2. **Empaquetar contenido**:
   ```bash
   # Crear archivo ZIP con toda la estructura
   zip -r mineria-datos-scorm.zip .
   ```

3. **Subir a Moodle**:
   - Añadir actividad → "Paquete SCORM"
   - Subir el archivo ZIP
   - Configurar parámetros SCORM

### Método 3: Recurso Externo

**Ventajas:**
- Simple y directo
- No requiere archivos en Moodle

**Pasos:**

1. **Crear actividad**:
   - Añadir actividad → "URL"
   - Ingresar la URL del sitio
   - Configurar "Mostrar" como "Incrustado"

## ⚙️ Configuración del Sitio para Moodle

### Modificaciones en JavaScript

Agregar comunicación con Moodle:

```javascript
// moodle-integration.js
class MoodleIntegration {
    constructor() {
        this.isInMoodle = this.detectMoodle();
        this.attemptId = this.getAttemptId();
        this.userId = this.getUserId();
    }

    detectMoodle() {
        return window.parent !== window &&
               window.parent.location.hostname.includes('moodle');
    }

    getAttemptId() {
        // Obtener attempt_id de Moodle si está disponible
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('attempt_id') || null;
    }

    getUserId() {
        // Obtener user_id de Moodle
        return this.getUrlParameter('user_id') || null;
    }

    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Comunicar progreso a Moodle
    sendProgress(percentage) {
        if (this.isInMoodle && this.attemptId) {
            try {
                window.parent.postMessage({
                    type: 'scorm_progress',
                    progress: percentage,
                    attempt_id: this.attemptId
                }, '*');
            } catch (error) {
                console.log('Error communicating with Moodle:', error);
            }
        }
    }

    // Enviar calificación
    sendScore(score, maxScore) {
        if (this.isInMoodle && this.attemptId) {
            try {
                window.parent.postMessage({
                    type: 'scorm_score',
                    score: score,
                    max_score: maxScore,
                    attempt_id: this.attemptId
                }, '*');
            } catch (error) {
                console.log('Error sending score to Moodle:', error);
            }
        }
    }

    // Marcar como completado
    setCompleted() {
        if (this.isInMoodle) {
            try {
                window.parent.postMessage({
                    type: 'scorm_complete',
                    attempt_id: this.attemptId
                }, '*');
            } catch (error) {
                console.log('Error marking completion:', error);
            }
        }
    }
}

// Inicializar integración
window.moodleIntegration = new MoodleIntegration();
```

### Modificaciones en HTML

Agregar soporte SCORM:

```html
<!-- Agregar en el head de index.html -->
<script src="js/moodle-integration.js"></script>
<script>
// API SCORM (simplificado)
var findAPITries = 0;
function findAPI(win) {
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 7) {
            return null;
        }
        win = win.parent;
    }
    return win.API;
}

function getAPI() {
    var theAPI = findAPI(window);
    if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
        theAPI = findAPI(window.opener);
    }
    if (theAPI == null) {
        return null;
    }
    return theAPI;
}

function initSCORM() {
    var api = getAPI();
    if (api) {
        api.LMSInitialize("");
        api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        api.LMSCommit("");
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    initSCORM();
});
</script>
```

## 📊 Seguimiento de Progreso

### Implementación de Tracking

```javascript
// progress-tracking.js
class ProgressTracker {
    constructor() {
        this.sections = document.querySelectorAll('.content-section');
        this.completedSections = new Set();
        this.totalSections = this.sections.length;
        this.initTracking();
    }

    initTracking() {
        // Observer para detectar cuando el usuario completa una sección
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.boundingClientRect.top < 200) {
                    this.markSectionCompleted(entry.target);
                }
            });
        }, {
            threshold: 0.8,
            rootMargin: '0px 0px -200px 0px'
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    markSectionCompleted(section) {
        const sectionId = section.getAttribute('id');
        if (!this.completedSections.has(sectionId)) {
            this.completedSections.add(sectionId);

            // Guardar en localStorage
            localStorage.setItem(`completed-${sectionId}`, 'true');

            // Enviar a Moodle
            const progress = (this.completedSections.size / this.totalSections) * 100;
            window.moodleIntegration?.sendProgress(progress);

            // Si completó todo, marcar curso como terminado
            if (this.completedSections.size === this.totalSections) {
                window.moodleIntegration?.setCompleted();
            }
        }
    }

    getProgress() {
        return (this.completedSections.size / this.totalSections) * 100;
    }
}
```

## 🎯 Integración de Evaluaciones

### Quizzes con Calificación

```javascript
// quiz-integration.js
class MoodleQuiz {
    constructor() {
        this.questions = [];
        this.currentScore = 0;
        this.maxScore = 0;
    }

    submitQuiz(answers) {
        // Calcular puntuación
        this.calculateScore(answers);

        // Enviar a Moodle
        window.moodleIntegration?.sendScore(this.currentScore, this.maxScore);

        // Guardar localmente
        this.saveResults(answers);
    }

    calculateScore(answers) {
        let correct = 0;
        answers.forEach((answer, index) => {
            if (this.isCorrect(answer, index)) {
                correct++;
            }
        });

        this.currentScore = correct;
        this.maxScore = answers.length;
    }

    isCorrect(answer, questionIndex) {
        // Lógica para verificar si la respuesta es correcta
        const correctAnswers = ['b', 'b', 'a']; // Respuestas correctas
        return answer === correctAnswers[questionIndex];
    }

    saveResults(answers) {
        const result = {
            score: this.currentScore,
            maxScore: this.maxScore,
            percentage: (this.currentScore / this.maxScore) * 100,
            answers: answers,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('quiz-results', JSON.stringify(result));
    }
}
```

## 🔧 Configuración Avanzada

### Personalización de Aspecto

```css
/* moodle-custom.css */
/* Estilos específicos para la integración con Moodle */

.moodle-integrated {
    /* Eliminar márgenes para mejor integración */
    margin: 0;
    padding: 0;
}

.moodle-integrated .navbar {
    /* Opcional: ocultar navegación si Moodle ya la provee */
    display: none;
}

.moodle-integrated .week-hero {
    /* Ajustar altura para mejor integración */
    min-height: 40vh;
}

/* Responsive específico para Moodle iframe */
@media screen and (max-width: 768px) {
    .moodle-integrated {
        font-size: 14px;
    }
}
```

### Configuración de Tamaño

```javascript
// resize-handler.js
class MoodleResize {
    constructor() {
        this.initResizeListener();
        this.adjustSize();
    }

    initResizeListener() {
        window.addEventListener('resize', () => {
            this.adjustSize();
        });

        // Observar cambios en el contenido
        const observer = new MutationObserver(() => {
            this.adjustSize();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    adjustSize() {
        const height = document.body.scrollHeight;

        if (window.moodleIntegration?.isInMoodle) {
            // Comunicar el nuevo tamaño al iframe de Moodle
            window.parent.postMessage({
                type: 'resize',
                height: height
            }, '*');
        }
    }
}
```

## 📋 Checklist de Integración

### ✅ Pre-Integración
- [ ] Todo el contenido está funcional localmente
- [ ] Los enlaces relativos funcionan correctamente
- [ ] Los recursos multimedia cargan apropiadamente
- [ ] El JavaScript funciona sin errores

### ✅ Configuración Técnica
- [ ] Elegir método de integración (iFrame/SCORM/URL)
- [ ] Preparar archivos para subida
- [ ] Configurar servidor web (si aplica)
- [ ] Probar carga en diferentes navegadores

### ✅ Integración con Moodle
- [ ] Crear actividad en Moodle
- [ ] Configurar parámetros de visualización
- [ ] Probar tracking de progreso
- [ ] Verificar funcionamiento de evaluaciones

### ✅ Testing Final
- [ ] Probar en dispositivos móviles
- [ ] Verificar accesibilidad
- [ ] Testear con diferentes roles de usuario
- [ ] Validar retroalimentación de progreso

## 🚨 Problemas Comunes y Soluciones

### Problema: El contenido no se muestra completamente

**Causa**: El iframe tiene un tamaño fijo demasiado pequeño.

**Solución**:
```javascript
// Ajustar automáticamente el tamaño del iframe
function adjustIframeHeight() {
    const iframe = window.frameElement;
    if (iframe) {
        iframe.style.height = document.body.scrollHeight + 'px';
    }
}

// Llamar cuando el contenido cambie
window.addEventListener('load', adjustIframeHeight);
window.addEventListener('resize', adjustIframeHeight);
```

### Problema: Los enlaces internos no funcionan

**Causa**: Los enlaces absolutos apuntan al dominio equivocado.

**Solución**:
```html
<!-- Usar rutas relativas -->
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js"></script>

<!-- O detectar si está en iframe y ajustar rutas -->
<script>
if (window.frameElement) {
    // Estamos en un iframe, usar rutas relativas
    const basePath = './';
} else {
    // No estamos en iframe, usar rutas normales
    const basePath = '/';
}
</script>
```

### Problema: El tracking no funciona

**Causa**: Restricciones de cross-origin entre dominios.

**Solución**:
```javascript
// Usar postMessage para comunicación segura
function sendToMoodle(data) {
    if (window.parent !== window) {
        window.parent.postMessage(data, '*');
    }
}

// Recibir mensajes del iframe padre
window.addEventListener('message', function(event) {
    if (event.data.type === 'moodle_ready') {
        // Moodle está listo para recibir datos
        console.log('Moodle integration ready');
    }
});
```

## 📞 Soporte

### Recursos Adicionales
- [Documentación Moodle SCORM](https://docs.moodle.org/310/en/SCORM_module)
- [SCORM 1.2 Runtime Reference](https://scorm.com/scorm-explained/technical-scorm/run-time/)
- [Moodle Developer Forums](https://moodle.org/forums/)

### Contacto
Para soporte técnico específico de esta integración:
- Issues en GitHub del proyecto
- Documentación adicional en `/docs/`

---

**Última actualización**: Octubre 2024
**Versión**: 1.0
**Compatibilidad**: Moodle 3.9+