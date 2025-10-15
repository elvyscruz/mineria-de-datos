# 🎓 Sitio Web Educativo - Minería de Datos

Un sitio web educacional interactivo y multimedia para el curso universitario de Minería de Datos, diseñado con HTML, CSS y JavaScript vanilla.

## 📋 Descripción del Proyecto

Este proyecto es un sitio web educativo completo para la enseñanza de Minería de Datos a nivel universitario. El sitio incluye 14 semanas de contenido, con materiales interactivos, visualizaciones, ejercicios prácticos y un sistema de evaluación integral.

### 🎯 Características Principales

- **Diseño Responsivo**: Adaptado para dispositivos móviles, tablets y desktop
- **Interfaz Moderna**: UI/UX atractiva con animaciones fluidas
- **Contenido Multimedia**: Videos, visualizaciones interactivas, gráficos animados
- **Sistema de Progreso**: Seguimiento individual del avance del estudiante
- **Evaluaciones Integradas**: Quizzes interactivos y actividades prácticas
- **Navegación Intuitiva**: Estructura clara por semanas y temas
- **Optimización SEO**: Mejorado para motores de búsqueda
- **Accesibilidad**: Cumple con estándares WCAG 2.1

## 🏗️ Estructura del Proyecto

```
mineria-de-datos/
├── index.html                 # Página principal
├── README.md                  # Documentación
├── css/                       # Hojas de estilo
│   ├── styles.css            # Estilos principales
│   ├── animations.css        # Animaciones y transiciones
│   └── semana-styles.css     # Estilos específicos de semanas
├── js/                        # Archivos JavaScript
│   ├── main.js               # Funcionalidad principal
│   ├── animations.js         # Sistema de animaciones
│   ├── hero-animation.js     # Animación del hero section
│   ├── semana-interactions.js # Interacciones de semanas
│   └── week-canvas.js        # Canvas animations
├── semanas/                   # Contenido por semanas
│   ├── semana1.html          # Introducción a la Minería de Datos
│   ├── semana2.html          # Fundamentos de Python
│   └── ...                  # (Más semanas por desarrollar)
├── assets/                    # Recursos multimedia
│   ├── videos/               # Videos educativos
│   ├── images/               # Imágenes y gráficos
│   └── icons/                # Iconos y SVGs
└── docs/                      # Documentación adicional
    ├── moodle-integration.md # Guía de integración con Moodle
    └── user-guide.md         # Guía de usuario
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Semántico y accesible
- **CSS3**: Grid, Flexbox, Animaciones, Variables CSS
- **JavaScript ES6+**: Vanilla JS, moderno y eficiente
- **Canvas API**: Visualizaciones interactivas
- **Local Storage**: Persistencia de datos locales

### Diseño y UX
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Funcionalidad garantizada
- **Intersection Observer**: Animaciones al scroll
- **CSS Animations**: Transiciones fluidas
- **Microinteractions**: Feedback visual constante

### Herramientas Externas
- **Font Awesome**: Iconos vectoriales
- **Google Fonts**: Tipografía profesional
- **JavaScript Libraries**: Solo librerías externas mínimas

## 🎨 Características de Diseño

### Sistema de Diseño
- **Paleta de Colores**: Coherente y accesible
- **Tipografía**: Jerarquía clara y legibilidad
- **Espaciado**: Sistema consistente de espacios
- **Componentes**: Reutilizables y modulares

### Interacciones
- **Animaciones al Scroll**: Revelación progresiva de contenido
- **Hover Effects**: Feedback visual en elementos interactivos
- **Loading States**: Indicadores de progreso
- **Notificaciones**: Sistema de mensajes no intrusivo
- **Formularios**: Validación en tiempo real

## 📚 Contenido Educativo

### Estructura del Curso (14 Semanas)
1. **Introducción a la Minería de Datos** ✅
2. **Fundamentos de Python para Análisis de Datos** 🔄
3. **Manipulación de Datos con pandas** ⏳
4. **Análisis Exploratorio y Visualización** ⏳
5. **Preparación de Datos** ⏳
6. **Introducción al Aprendizaje Automático** ⏳
7. **Evaluación Parcial #1** ⏳
8. **Clasificación – Modelos Supervisados** ⏳
9. **Regresión – Modelos Supervisados** ⏳
10. **Agrupamiento – Modelos No Supervisados** ⏳
11. **Reducción de Dimensionalidad** ⏳
12. **Detección de Anomalías y Reglas de Asociación** ⏳
13. **Proyecto Integrador** ⏳
14. **Evaluación Final** ⏳

### Elementos Educativos
- **Teoría**: Conceptos fundamentales con ejemplos
- **Práctica**: Ejercicios guiados y proyectos
- **Evaluación**: Quizzes y actividades de autoevaluación
- **Recursos**: Materiales adicionales y referencias
- **Progreso**: Seguimiento individual del aprendizaje

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)
- Editor de código (VSCode recomendado)

### Instalación Rápida
1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/mineria-de-datos.git
   cd mineria-de-datos
   ```

2. **Abrir en navegador**:
   ```bash
   # Opción 1: Abrir directamente
   open index.html

   # Opción 2: Usar servidor local
   python -m http.server 8000
   # Luego abrir http://localhost:8000
   ```

3. **Verificar funcionamiento**:
   - La página principal debe cargar correctamente
   - Las animaciones deben ser fluidas
   - La navegación debe funcionar en todas las secciones

## 🔧 Personalización

### Modificar Contenido
1. **Editar HTML**: Modificar archivos en la carpeta `/semanas/`
2. **Actualizar CSS**: Personalizar estilos en `/css/`
3. **Ajustar JavaScript**: Modificar interacciones en `/js/`

### Cambiar Colores y Tema
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... más variables */
}
```

### Agregar Nueva Semana
1. Copiar `semana1.html` como plantilla
2. Modificar contenido según nueva semana
3. Actualizar navegación en `index.html`
4. Ajustar progresos y enlaces

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos
- ✅ Desktop (1920x1080+)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (320px - 768px)

## 🎯 Características Interactivas

### Sistema de Progreso
- Seguimiento de temas completados
- Indicadores visuales de avance
- Persistencia local con localStorage
- Estadísticas de aprendizaje

### Quiz Interactivo
- Preguntas con retroalimentación inmediata
- Sistema de calificación automático
- Guardado de resultados
- Intentos múltiples

### Canvas Animations
- Visualizaciones de datos interactivas
- Partículas animadas
- Efectos de mouse hover
- Gráficos en tiempo real

### Code Snippets
- Sintaxis resaltada
- Botón de copiar código
- Números de línea
- Ejemplos ejecutables

## 🔒 Accesibilidad

### Características Implementadas
- **Navegación por Teclado**: Tab order lógico
- **Screen Readers**: ARIA labels y roles
- **Contraste**: WCAG AA compliance
- **Texto Alternativo**: Descriptivo para imágenes
- **Focus Management**: Indicadores visuales claros

### Mejoras Continuas
- Validación con herramientas de accesibilidad
- Testing con lectores de pantalla
- Optimización para contraste alto
- Mejoras en navegación táctil

## 🚀 Optimización

### Performance
- **Lazy Loading**: Carga progresiva de contenido
- **Minificación**: CSS y JavaScript optimizados
- **Imágenes Optimizadas**: WebP y compresión
- **Caching Strategy**: Headers apropiados

### SEO
- **Meta Tags**: Descriptivos y relevantes
- **URLs Semánticas**: Estructura lógica
- **Sitemap.xml**: Para indexación
- **Structured Data**: Schema.org markup

## 🔄 Integración con Moodle

### Preparación para Moodle
1. **Estructura SCORM**: Compatible con estándares
2. **Exportación**: Formato HTML empacado
3. **Seguimiento**: Comunicación con LMS
4. **Evaluaciones**: Integración con calificaciones

### Guía de Integración
Ver `docs/moodle-integration.md` para instrucciones detalladas.

## 🤝 Contribución

### Cómo Contribuir
1. Fork del repositorio
2. Crear rama de características: `git checkout - feature/nueva-caracteristica`
3. Commit de cambios: `git commit -m 'Agregar nueva característica'`
4. Push a la rama: `git push origin feature/nueva-caracteristica`
5. Pull Request detallado

### Estándares de Código
- **HTML**: Semántico y bien estructurado
- **CSS**: BEM methodology, variables CSS
- **JavaScript**: ES6+, modular y comentado
- **Comentarios**: Claros y descriptivos

## 📝 Licencia

Este proyecto está bajo la Licencia Educativa - ver archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto y Soporte

### Información del Proyecto
- **Autor**: [Tu Nombre]
- **Institución**: [Nombre de la Institución]
- **Curso**: Minería de Datos
- **Nivel**: Universitario

### Soporte Técnico
- **Issues**: GitHub Issues
- **Documentación**: `/docs/`
- **Guía de Usuario**: `docs/user-guide.md`

## 🗺️ Roadmap Futuro

### Próximas Características
- [ ] **Semana 2-14**: Completar contenido restante
- [ ] **Jupyter Notebooks**: Integración en línea
- [ ] **Gamificación**: Sistema de puntos y logros
- [ ] **Foros Discusión**: Comunidad integrada
- [ ] **Analytics**: Dashboards de progreso
- [ ] **API REST**: Backend para datos
- [ ] **PWA**: Funcionalidad offline
- [ ] **Multiidioma**: Soporte en inglés y portugués

### Mejoras Técnicas
- [ ] **TypeScript**: Migración gradual
- [ ] **Testing**: Unit y E2E tests
- [ ] **CI/CD**: Pipeline automatizado
- [ ] **Docker**: Contenerización
- [ ] **CDN**: Distribución global

---

## 🎉 Agradecimientos

Este proyecto ha sido desarrollado con el objetivo de facilitar el aprendizaje de la Minería de Datos de una manera interactiva y accesible para todos los estudiantes.

**¡Gracias por utilizar este recurso educativo!**

---

*Última actualización: Octubre 2024*