const API_BASE_URL = 'http://localhost:7000/api';

async function fetchStock() {
    const r = await fetch(`${API_BASE_URL}/charts/products-stock`);
    if (!r.ok) throw new Error('Error obteniendo stock');
    return await r.json();
}

function drawBarChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    const padding = 40;
    const labelArea = 220;
    const barAreaWidth = width - padding * 2 - labelArea;
    const barHeight = 26;
    const gap = 16;
    const maxStock = Math.max(...data.map(d => d.stock), 1);
    const startY = padding;
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    data.forEach((d, i) => {
        const y = startY + i * (barHeight + gap);
        const xLabel = padding;
        const xBar = padding + labelArea;
        const wBar = Math.round((d.stock / maxStock) * barAreaWidth);
        ctx.fillStyle = '#222';
        ctx.fillText(`${d.nombre}`, xLabel, y + barHeight - 8);
        ctx.fillStyle = '#F9BD31';
        ctx.fillRect(xBar, y, wBar, barHeight);
        ctx.fillStyle = '#000';
        ctx.fillText(`${d.stock}`, xBar + wBar + 8, y + barHeight - 8);
    });
}

function renderTable(container, data) {
    const rows = data.map(d => `<tr><td>${d.nombre}</td><td>${d.stock}</td></tr>`).join('');
    container.innerHTML = `
      <table>
        <thead><tr><th>Producto</th><th>Stock</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
}

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('stockChart');
    const tableContainer = document.getElementById('tableContainer');
    try {
        const data = await fetchStock();
        const normalized = Array.isArray(data) ? data.map(x => ({ nombre: x.nombre || x.Nombre || 'Producto', stock: Number(x.stock || x.Stock || 0) })) : [];
        drawBarChart(canvas, normalized);
        renderTable(tableContainer, normalized);
        window.addEventListener('resize', () => drawBarChart(canvas, normalized));
    } catch (e) {
        tableContainer.innerHTML = `<p style="color:#e53935">${e.message}</p>`;
    }
});
