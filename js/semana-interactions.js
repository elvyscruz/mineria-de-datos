// ===== INTERACCIONES ESPECÍFICAS PARA PÁGINAS DE SEMANAS =====

document.addEventListener('DOMContentLoaded', function() {
    initWeekInteractions();
    initNavigationSystem();
    initProgressTracking();
    initQuizSystem();
    initCodeInteractions();
    initAnimations();
});

// ===== INICIALIZACIÓN PRINCIPAL =====
function initWeekInteractions() {
    // Smooth scroll para navegación de temas
    initSmoothScroll();

    // Sistema de progreso
    updateProgressIndicators();

    // Animaciones al hacer scroll
    initScrollAnimations();

    // Sistema de checklists
    initChecklistSystem();

    // Sistema de notificaciones
    initNotificationSystem();
}

// ===== SISTEMA DE NAVEGACIÓN =====
function initNavigationSystem() {
    const topicLinks = document.querySelectorAll('.topic-link');
    const sections = document.querySelectorAll('.content-section');

    // Verificar que existen los elementos
    if (!topicLinks.length || !sections.length) {
        console.log('No se encontraron enlaces de navegación o secciones');
        return;
    }

    // Actualizar navegación activa al hacer scroll
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Offset para considerar el navbar fijo
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Si no hay sección actual, usar la primera
        if (!current && sections.length > 0) {
            current = sections[0].getAttribute('id');
        }

        // Actualizar enlaces activos
        topicLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href === `#${current}`) {
                link.classList.add('active');

                // Actualizar progreso
                updateSectionProgress(current);
            }
        });
    }

    // Click en enlaces de navegación
    topicLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');

            if (!href || href === '#') {
                console.log('Enlace inválido:', href);
                return;
            }

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;

                // Smooth scroll con fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback para navegadores antiguos
                    window.scrollTo(0, offsetTop);
                }

                // Actualizar navegación activa inmediatamente
                setTimeout(() => {
                    topicLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }, 100);
            } else {
                console.log('No se encontró la sección:', targetId);
                showNotification('Sección no encontrada', 'warning');
            }
        });
    });

    // Event listener para scroll con throttling
    let ticking = false;
    function scrollHandler() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Inicializar
    updateActiveNav();
}

// ===== SISTEMA DE PROGRESO =====
function initProgressTracking() {
    // Cargar progreso guardado
    loadSavedProgress();

    // Configurar observadores de progreso
    setupProgressObservers();

    // Actualizar indicadores visuales
    updateAllProgressIndicators();
}

function updateProgressIndicators() {
    const sections = document.querySelectorAll('.content-section');
    let completedSections = 0;

    sections.forEach(section => {
        if (isSectionCompleted(section)) {
            completedSections++;
        }
    });

    const progressPercentage = (completedSections / sections.length) * 100;
    updateProgressBar(progressPercentage);
}

function isSectionCompleted(section) {
    // Lógica para determinar si una sección está completada
    const sectionId = section.getAttribute('id');
    const savedState = localStorage.getItem(`section-${sectionId}`);

    if (savedState === 'completed') {
        return true;
    }

    // Verificar si hay checklists completados
    const checkboxes = section.querySelectorAll('input[type="checkbox"]:checked');
    const totalCheckboxes = section.querySelectorAll('input[type="checkbox"]');

    if (totalCheckboxes.length > 0 && checkboxes.length === totalCheckboxes.length) {
        return true;
    }

    // Verificar si el usuario ha llegado al final de la sección
    const rect = section.getBoundingClientRect();
    if (rect.bottom < window.innerHeight) {
        return true;
    }

    return false;
}

function updateProgressBar(percentage) {
    // Actualizar barra de progreso principal
    const mainProgressBar = document.querySelector('.progress-fill');
    if (mainProgressBar) {
        mainProgressBar.style.width = `${percentage}%`;
    }

    // Actualizar barra de progreso del sidebar
    const sidebarProgress = document.querySelector('.progress-summary .progress-fill');
    if (sidebarProgress) {
        sidebarProgress.style.width = `${percentage}%`;
    }

    // Actualizar texto de progreso
    const progressText = document.querySelector('.progress-summary span');
    if (progressText) {
        const sections = document.querySelectorAll('.content-section');
        const completed = Math.round((percentage / 100) * sections.length);
        progressText.textContent = `${completed} de ${sections.length} temas completados`;
    }

    // Guardar progreso
    saveProgress(percentage);
}

function updateSectionProgress(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && isSectionCompleted(section)) {
        markSectionAsCompleted(sectionId);
    }
}

function markSectionAsCompleted(sectionId) {
    // Actualizar estado en localStorage
    localStorage.setItem(`section-${sectionId}`, 'completed');

    // Actualizar UI
    const progressItem = document.querySelector(`[href="#${sectionId}"]`).closest('.progress-item');
    if (progressItem) {
        progressItem.classList.add('completed');
        progressItem.querySelector('i').className = 'fas fa-check-circle';
    }

    // Actualizar progreso general
    updateProgressIndicators();

    // NOTIFICACIÓN COMENTADA para evitar spam
    // Si quieres activarla, descomenta la siguiente línea:
    // showNotification(`¡Sección "${getSectionTitle(sectionId)}" completada!`, 'success');
}

function getSectionTitle(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const title = section.querySelector('h2');
        return title ? title.textContent : sectionId;
    }
    return sectionId;
}

// ===== SISTEMA DE QUIZ =====
function initQuizSystem() {
    const quizForm = document.querySelector('.quiz-container');
    if (!quizForm) return;

    const submitButton = document.querySelector('button[onclick="checkQuiz()"]');
    if (submitButton) {
        submitButton.addEventListener('click', checkQuiz);
    }
}

function checkQuiz() {
    const questions = document.querySelectorAll('.question');
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    if (!questions.length) {
        showNotification('No se encontraron preguntas en el quiz', 'warning');
        return;
    }

    // Respuestas correctas para cada pregunta
    const correctAnswersKey = ['b', 'b', 'a'];

    // Resetear todos los feedbacks primero
    questions.forEach(question => {
        const feedback = question.querySelector('.feedback');
        if (feedback) {
            feedback.style.display = 'none';
            feedback.className = 'feedback';
        }
    });

    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        const feedback = question.querySelector('.feedback');

        if (selectedOption) {
            const answer = selectedOption.value;
            const correctAnswer = correctAnswersKey[index];

            // Mostrar feedback
            if (feedback) {
                feedback.style.display = 'flex';

                if (answer === correctAnswer) {
                    correctAnswers++;
                    feedback.style.background = '#dcfce7';
                    feedback.style.color = '#166534';
                    feedback.querySelector('i').className = 'fas fa-check-circle';
                    feedback.querySelector('span').textContent = '¡Correcto! ' + getExplanation(index, true);
                } else {
                    feedback.style.background = '#fee2e2';
                    feedback.style.color = '#dc2626';
                    feedback.querySelector('i').className = 'fas fa-times-circle';
                    feedback.querySelector('span').textContent = 'Incorrecto. ' + getExplanation(index, false);
                }
            }
        } else {
            // Marcar preguntas no respondidas
            if (feedback) {
                feedback.style.display = 'flex';
                feedback.style.background = '#fef3c7';
                feedback.style.color = '#d97706';
                feedback.querySelector('i').className = 'fas fa-exclamation-triangle';
                feedback.querySelector('span').textContent = 'Por favor selecciona una respuesta.';
            }
        }
    });

    // Mostrar resultado final
    const percentage = (correctAnswers / totalQuestions) * 100;
    showQuizResult(correctAnswers, totalQuestions, percentage);

    // Guardar resultado
    saveQuizResult(correctAnswers, totalQuestions, percentage);

    // Si el quiz está aprobado, marcar la sección como completada
    if (percentage >= 60) {
        setTimeout(() => {
            markSectionAsCompleted('evaluacion');
        }, 1000);
    }
}

function getExplanation(questionIndex, isCorrect) {
    const explanations = [
        {
            correct: "Los datos son hechos brutos mientras que la información tiene contexto y significado.",
            incorrect: "Los datos son hechos brutos sin procesar, mientras que la información son datos organizados con contexto que responden a preguntas específicas."
        },
        {
            correct: "Es un problema de clasificación porque queremos asignar una categoría (spam/no spam).",
            incorrect: "La clasificación es la técnica adecuada para predecir categorías discretas como spam o no spam."
        },
        {
            correct: "El diagnóstico médico asistido es una aplicación importante de minería de datos.",
            incorrect: "Otras aplicaciones como la gestión de citas o facturación no son consideradas minería de datos propiamente dicha."
        }
    ];

    if (questionIndex < explanations.length) {
        return isCorrect ? explanations[questionIndex].correct : explanations[questionIndex].incorrect;
    }

    return isCorrect ? "Respuesta correcta." : "Respuesta incorrecta. Revisa el material de estudio.";
}

function showQuizResult(correct, total, percentage) {
    let message = '';
    let type = 'info';

    if (percentage >= 80) {
        message = `¡Excelente! Has respondido correctamente ${correct} de ${total} preguntas (${percentage.toFixed(0)}%).`;
        type = 'success';
    } else if (percentage >= 60) {
        message = `Buen trabajo. Has respondido correctamente ${correct} de ${total} preguntas (${percentage.toFixed(0)}%).`;
        type = 'info';
    } else {
        message = `Necesitas repasar los conceptos. Has respondido correctamente ${correct} de ${total} preguntas (${percentage.toFixed(0)}%).`;
        type = 'warning';
    }

    showNotification(message, type);

    // Si el quiz está aprobado, marcar la sección como completada
    if (percentage >= 60) {
        setTimeout(() => {
            markSectionAsCompleted('evaluacion');
        }, 1000);
    }
}

// ===== INTERACCIONES DE CÓDIGO =====
function initCodeInteractions() {
    // Botones de copiar código
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => copyCode(button));
    });

    // Resaltado de sintaxis (opcional)
    initSyntaxHighlighting();

    // Contador de líneas (opcional)
    initLineNumbers();
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    let code;

    // Buscar el elemento de código
    if (codeBlock.querySelector('code')) {
        code = codeBlock.querySelector('code');
    } else if (codeBlock.querySelector('pre')) {
        code = codeBlock.querySelector('pre');
    } else {
        showNotification('No se encontró el código para copiar', 'error');
        return;
    }

    if (code) {
        // Obtener el texto del código, eliminando números de línea si existen
        let codeText = code.textContent || code.innerText;

        // Si hay números de línea, eliminarlos
        if (codeBlock.querySelector('.line-numbers')) {
            const lines = codeText.split('\n');
            const cleanLines = lines.map(line => line.replace(/^\s*\d+\s*/, ''));
            codeText = cleanLines.join('\n');
        }

        // Usar la API moderna del portapapeles
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeText).then(() => {
                // Cambiar ícono temporalmente
                const icon = button.querySelector('i');
                const originalIcon = icon.className;
                icon.className = 'fas fa-check';

                // Cambiar color de fondo
                button.style.background = '#10b981';
                button.style.color = 'white';

                // Restaurar después de 2 segundos
                setTimeout(() => {
                    icon.className = originalIcon;
                    button.style.background = '';
                    button.style.color = '';
                }, 2000);

                // Mostrar notificación
                showNotification('¡Código copiado al portapapeles!', 'success');
            }).catch(err => {
                console.error('Error al copiar código:', err);
                // Fallback para navegadores antiguos
                fallbackCopyText(codeText, button);
            });
        } else {
            // Fallback para navegadores antiguos
            fallbackCopyText(codeText, button);
        }
    }
}

function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');

        // Cambiar ícono temporalmente
        const icon = button.querySelector('i');
        const originalIcon = icon.className;
        icon.className = 'fas fa-check';

        // Cambiar color
        button.style.background = '#10b981';
        button.style.color = 'white';

        // Restaurar después de 2 segundos
        setTimeout(() => {
            icon.className = originalIcon;
            button.style.background = '';
            button.style.color = '';
        }, 2000);

        showNotification('¡Código copiado al portapapeles!', 'success');
    } catch (err) {
        console.error('Error al copiar código (fallback):', err);
        showNotification('Error al copiar código', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

function initSyntaxHighlighting() {
    // Aquí podrías integrar una librería como Prism.js o highlight.js
    // Por ahora, usaremos estilos básicos
    const codeBlocks = document.querySelectorAll('code');

    codeBlocks.forEach(block => {
        // Resaltar palabras clave básicas
        let content = block.textContent;

        // Palabras clave de Python
        const keywords = ['import', 'from', 'as', 'def', 'class', 'if', 'else', 'for', 'while', 'return', 'print'];

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            content = content.replace(regex, `<span class="keyword">${keyword}</span>`);
        });

        // Resaltar strings
        content = content.replace(/(['"])([^'"]*)\1/g, '<span class="string">$&</span>');

        // Resaltar comentarios
        content = content.replace(/(#.*)/g, '<span class="comment">$1</span>');

        block.innerHTML = content;
    });
}

function initLineNumbers() {
    const codeBlocks = document.querySelectorAll('.code-block');

    codeBlocks.forEach(block => {
        const code = block.querySelector('code');
        if (code) {
            const lines = code.textContent.split('\n');
            const lineNumbers = lines.map((_, index) => index + 1).join('\n');

            const lineNumbersContainer = document.createElement('div');
            lineNumbersContainer.className = 'line-numbers';
            lineNumbersContainer.textContent = lineNumbers;

            block.style.display = 'flex';
            block.prepend(lineNumbersContainer);
        }
    });
}

// ===== SISTEMA DE CHECKLIST =====
function initChecklistSystem() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const itemId = e.target.id || e.target.closest('.checklist-item').textContent.trim();

            if (e.target.checked) {
                markItemCompleted(itemId);
                showNotification('¡Tarea completada!', 'success');

                // Verificar si toda la sección está completada
                checkSectionCompletion(e.target.closest('.content-section'));
            } else {
                markItemIncomplete(itemId);
            }

            // Guardar estado
            saveChecklistState(itemId, e.target.checked);
        });
    });

    // Cargar estados guardados
    loadChecklistStates();
}

function checkSectionCompletion(section) {
    if (!section) return;

    const checkboxes = section.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = section.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length > 0 && checkedBoxes.length === checkboxes.length) {
        const sectionId = section.getAttribute('id');
        markSectionAsCompleted(sectionId);
    }
}

function markItemCompleted(itemId) {
    // Animación de completado
    const item = document.querySelector(`[for="${itemId}"]`) || document.getElementById(itemId);
    if (item) {
        item.classList.add('completed');

        // Añadir animación
        item.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
            item.style.animation = '';
        }, 500);
    }
}

function markItemIncomplete(itemId) {
    const item = document.querySelector(`[for="${itemId}"]`) || document.getElementById(itemId);
    if (item) {
        item.classList.remove('completed');
    }
}

// ===== SISTEMA DE NOTIFICACIONES =====
function initNotificationSystem() {
    // Crear contenedor de notificaciones si no existe
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = getNotificationIcon(type);

    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto cerrar
    setTimeout(() => {
        closeNotification(notification.querySelector('.notification-close'));
    }, duration);

    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    return icons[type] || icons.info;
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// ===== ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.dataset.animate;
                const delay = entry.target.dataset.delay || 0;

                setTimeout(() => {
                    entry.target.classList.add(animation);
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, delay);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FUNCIONES DE ALMACENAMIENTO =====
function saveProgress(percentage) {
    localStorage.setItem('course-progress', percentage);
}

function loadSavedProgress() {
    const savedProgress = localStorage.getItem('course-progress');
    if (savedProgress) {
        updateProgressBar(parseFloat(savedProgress));
    }
}

function saveQuizResult(correct, total, percentage) {
    const result = {
        correct,
        total,
        percentage,
        date: new Date().toISOString()
    };

    localStorage.setItem('quiz-result', JSON.stringify(result));
}

function saveChecklistState(itemId, checked) {
    const states = JSON.parse(localStorage.getItem('checklist-states') || '{}');
    states[itemId] = checked;
    localStorage.setItem('checklist-states', JSON.stringify(states));
}

function loadChecklistStates() {
    const states = JSON.parse(localStorage.getItem('checklist-states') || '{}');

    Object.entries(states).forEach(([itemId, checked]) => {
        const checkbox = document.getElementById(itemId);
        if (checkbox) {
            checkbox.checked = checked;
            if (checked) {
                markItemCompleted(itemId);
            }
        }
    });
}

// ===== CONFIGURACIÓN DE OBSERVADORES =====
function setupProgressObservers() {
    const sections = document.querySelectorAll('.content-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.boundingClientRect.top < 200) {
                const sectionId = entry.target.getAttribute('id');
                updateSectionProgress(sectionId);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -200px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ===== ACTUALIZACIÓN DE INDICADORES =====
function updateAllProgressIndicators() {
    const sections = document.querySelectorAll('.content-section');
    let completed = 0;

    sections.forEach(section => {
        if (isSectionCompleted(section)) {
            completed++;
            markSectionAsCompleted(section.getAttribute('id'));
        }
    });

    const percentage = (completed / sections.length) * 100;
    updateProgressBar(percentage);
}

// ===== INICIALIZACIÓN DE ANIMACIONES =====
function initAnimations() {
    // Animar números
    const numbers = document.querySelectorAll('[data-count]');

    numbers.forEach(number => {
        const target = parseInt(number.dataset.count);
        const suffix = number.dataset.suffix || '';
        const duration = parseInt(number.dataset.duration) || 2000;

        animateNumber(number, target, suffix, duration);
    });
}

function animateNumber(element, target, suffix, duration) {
    let current = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// ===== TOGGLE VIDEO =====
function toggleVideo(button) {
    const videoContainer = document.querySelector('.video-container');

    if (videoContainer.style.display === 'none') {
        videoContainer.style.display = 'block';
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Video';

        // Aquí podrías inicializar el reproductor de video
        initVideoPlayer();
    } else {
        videoContainer.style.display = 'none';
        button.innerHTML = '<i class="fas fa-video"></i> Ver Video';
    }
}

function initVideoPlayer() {
    // Lógica para inicializar el reproductor de video
    const placeholder = document.querySelector('.video-placeholder');
    if (placeholder) {
        // Aquí podrías integrar YouTube, Vimeo o un reproductor personalizado
        placeholder.innerHTML = `
            <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                frameborder="0"
                allowfullscreen>
            </iframe>
        `;
    }
}

// ===== FORMULARIO DE ENTREGA =====
document.addEventListener('DOMContentLoaded', function() {
    const submissionForm = document.querySelector('.submission-form form');
    if (submissionForm) {
        submissionForm.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('student-name');
    const githubInput = document.getElementById('github-link');
    const commentsInput = document.getElementById('comments');
    const fileInput = document.getElementById('file-upload');

    const data = {
        name: nameInput?.value || '',
        github: githubInput?.value || '',
        comments: commentsInput?.value || '',
        file: fileInput?.files[0]
    };

    // Validar formulario
    if (!data.name || !data.name.trim()) {
        showNotification('Por favor ingresa tu nombre completo', 'error');
        nameInput?.focus();
        return;
    }

    if (!data.file) {
        showNotification('Por favor selecciona un archivo para subir', 'error');
        fileInput?.focus();
        return;
    }

    // Validar tipo de archivo
    const allowedTypes = ['.ipynb', '.py', '.txt'];
    const fileExtension = data.file.name.toLowerCase().substring(data.file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(fileExtension)) {
        showNotification('Por favor sube un archivo válido (.ipynb, .py, .txt)', 'error');
        return;
    }

    // Mostrar loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simular envío (en producción, aquí iría el fetch real)
    setTimeout(() => {
        // Guardar en localStorage como simulación
        const submission = {
            ...data,
            fileName: data.file.name,
            fileSize: data.file.size,
            fileType: fileExtension,
            timestamp: new Date().toISOString()
        };

        // Guardar envío
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        submissions.push(submission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        localStorage.setItem('last-submission', JSON.stringify(submission));

        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Mostrar éxito
        showNotification('¡Actividad enviada exitosamente!', 'success');

        // Limpiar formulario
        e.target.reset();

        // Marcar sección como completada
        setTimeout(() => {
            markSectionAsCompleted('evaluacion');

            // Actualizar UI del sidebar
            updateSubmissionUI(submission);
        }, 1000);
    }, 2000);
}

function updateSubmissionUI(submission) {
    // Mostrar información del último envío
    const submissionInfo = document.querySelector('.submission-info');
    if (submissionInfo) {
        submissionInfo.innerHTML = `
            <div class="submission-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Última entrega:</strong> ${submission.fileName}<br>
                    <small>Fecha: ${new Date(submission.timestamp).toLocaleString()}</small>
                </div>
            </div>
        `;
        submissionInfo.style.display = 'block';
    }
}

// ===== EXPORT PARA USO GLOBAL =====
window.showNotification = showNotification;
window.closeNotification = closeNotification;
window.copyCode = copyCode;
window.toggleVideo = toggleVideo;
window.checkQuiz = checkQuiz;
window.handleFormSubmit = handleFormSubmit;