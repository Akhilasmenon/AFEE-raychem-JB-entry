/**
 * ==========================================================================
 * Interactive Layout Studio - Application Core Logic
 * ==========================================================================
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const countDisplay = document.getElementById("circle-count");

// Core Application Structural State Storage
let rectangle = null;
let circles = [];

// Drag and Drop State Management Tracking Indicators
let isDragging = false;
let draggedCircleIndex = null;
let offsetX = 0;
let offsetY = 0;

// Initialize Workspace Layout Configurations immediately upon DOM loading cycle 
window.addEventListener("DOMContentLoaded", () => {
    drawRectangle();
});

/**
 * Parses user panel inputs to initialize the base bounding container layout matrix
 */
function drawRectangle() {
    const length = parseFloat(document.getElementById("length").value) || 400;
    const breadth = parseFloat(document.getElementById("breadth").value) || 300;

    // Dynamically center coordinates calculations relative to canvas view frame proportions
    rectangle = {
        x: Math.max(20, (canvas.width - length) / 2),
        y: Math.max(20, (canvas.height - breadth) / 2),
        width: length,
        height: breadth
    };

    // Reset circles array to maintain clean layout instance logic states
    circles = []; 
    updateUIElements();
}

/**
 * Generates and stacks an individual node object inside the container bounds
 */
function addCircle() {
    if (!rectangle) return;

    const d = parseFloat(document.getElementById("diameter").value) || 50;
    const r = d / 2;

    // Enforce safety constraint boundary locks
    if (d > rectangle.width || d > rectangle.height) {
        alert("The circle dimensions exceed current boundary bounds.");
        return;
    }

    // Elegant placement staggering matrix calculations to avoid perfect clipping overrides on rapid key presses
    const scatterOffset = (circles.length * 12) % Math.min(80, rectangle.width - d);

    circles.push({
        x: rectangle.x + r + 15 + scatterOffset,
        y: rectangle.y + r + 15 + scatterOffset,
        r: r
    });

    updateUIElements();
}

/**
 * Synchronization layer updating structural counters before drawing pipelines
 */
function updateUIElements() {
    if (countDisplay) {
        countDisplay.textContent = circles.length;
    }
    render();
}

/**
 * Main graphics rendering loop engine mapping elements into the Canvas viewport 2D context
 */
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Render Dash-Stroke Blueprint Style Boundary Area
    if (rectangle) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]); 
        ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        ctx.setLineDash([]); // Flush trace modifications 
    }

    // 2. Compute Intersections and Vector Render Active Circles
    circles.forEach((c, index) => {
        let isIntersecting = false;

        // Dynamic algorithmic collision monitoring loop
        circles.forEach((other, otherIndex) => {
            if (index === otherIndex) return;

            const dx = c.x - other.x;
            const dy = c.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < c.r + other.r) {
                isIntersecting = true;
            }
        });

        // Initialize Arc Matrix Vectors
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        
        // Colors mapping logic matching theme configurations
        if (isIntersecting) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
            ctx.strokeStyle = "#ef4444";
        } else {
            ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
            ctx.strokeStyle = "#10b981";
        }

        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Core anchor point coordinate layout design decoration
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = isIntersecting ? "#ef4444" : "#10b981";
        ctx.fill();
    });
}

/**
 * Resets memory objects references and flushes visual views
 */
function clearCanvas() {
    rectangle = null;
    circles = [];
    updateUIElements();
}

/**
 * ==========================================================================
 * Mouse Coordinates & Vector Matrix Collision Calculations
 * ==========================================================================
 */

/**
 * Formats absolute client bounds configurations mapped back natively into the canvas wrapper coordinate matrix
 */
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

/**
 * Returns index matching point array intercept targets, processed backwards to prioritize visual rendering layers hierarchy
 */
function detectTargetCircle(mousePos) {
    for (let i = circles.length - 1; i >= 0; i--) {
        const c = circles[i];
        const dx = mousePos.x - c.x;
        const dy = mousePos.y - c.y;
        if (Math.sqrt(dx * dx + dy * dy) <= c.r) {
            return i;
        }
    }
    return null;
}

// --- Event Listeners Engine Subsystem Binding Layout Layers ---

canvas.addEventListener("mousedown", (e) => {
    const mousePos = getMousePos(e);
    const targetIndex = detectTargetCircle(mousePos);

    if (targetIndex !== null) {
        isDragging = true;
        draggedCircleIndex = targetIndex;
        offsetX = mousePos.x - circles[targetIndex].x;
        offsetY = mousePos.y - circles[targetIndex].y;
        canvas.className = "grabbing"; // Modifies cursor context class properties mapping via CSS
    }
});

canvas.addEventListener("mousemove", (e) => {
    const mousePos = getMousePos(e);

    // Dynamic Hover Pointer Styling Class Shifts
    if (!isDragging) {
        const hasTarget = detectTargetCircle(mousePos) !== null;
        canvas.className = hasTarget ? "hovering" : "";
    }

    if (!isDragging || draggedCircleIndex === null || !rectangle) return;

    let targetX = mousePos.x - offsetX;
    let targetY = mousePos.y - offsetY;

    const c = circles[draggedCircleIndex];

    // Bounding calculation perimeter wall constraints formulas
    const minX = rectangle.x + c.r;
    const maxX = rectangle.x + rectangle.width - c.r;
    const minY = rectangle.y + c.r;
    const maxY = rectangle.y + rectangle.height - c.r;

    // Evaluate translation constraints limits overrides
    if (targetX < minX) targetX = minX;
    if (targetX > maxX) targetX = maxX;
    if (targetY < minY) targetY = minY;
    if (targetY > maxY) targetY = maxY;

    // Write parameters modifications values straight into working objects instances
    c.x = targetX;
    c.y = targetY;

    render();
});

const dropTarget = () => {
    isDragging = false;
    draggedCircleIndex = null;
    canvas.className = "";
};

canvas.addEventListener("mouseup", dropTarget);
canvas.addEventListener("mouseleave", dropTarget);

// Double-Click Action Route - Removes specifically Targeted Element Entries Instantly
canvas.addEventListener("dblclick", (e) => {
    const mousePos = getMousePos(e);
    const targetIndex = detectTargetCircle(mousePos);

    if (targetIndex !== null) {
        circles.splice(targetIndex, 1);
        updateUIElements();
    }
});