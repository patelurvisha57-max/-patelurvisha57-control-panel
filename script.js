function showForm(itemId) {
    document.querySelectorAll('.form-section').forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById('output').style.display = 'none';

    // જો કોઈ ચોક્કસ આઈટમ સિલેક્ટ કરી હોય, તો તેને બતાવો
    if (itemId) {
        const selectedForm = document.getElementById(itemId);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
    }
}
function showTextboxes() {
    const category = document.getElementById('category').value;
    const container = document.getElementById('textboxContainer');
    container.innerHTML = ''; 

    if (!category) return;

    let fields = [];
    if (category === 'BAN') fields = ['ID (mm)', 'Width (mm)'];
    else if (category === 'PLA') fields = ['Length (mm)', 'Width (mm)', 'Thickness (mm)'];
    else if (category === 'DIS') fields = ['Diameter (mm)', 'Thickness (mm)'];
    else fields = ['Size/Dimensions'];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `
            <label>${field}:</label>
            <input type="text" name="dim_${field.replace(/\s+/g, '_')}" placeholder="Enter ${field}" required>
        `;
        container.appendChild(div);
    });
}
function generateCode(event, prefix, itemLabel) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let codeParts = [prefix];
    let descParts = [itemLabel];

    for (let [name, value] of formData.entries()) {
        if (!value) continue;

        const element = form.querySelector(`[name="${name}"]`);
        
        if (element && element.tagName === 'SELECT') {
            const selectedOption = element.options[element.selectedIndex];
            const fullText = selectedOption.getAttribute('data-full') || value;
            
            codeParts.push(value);
            descParts.push(fullText);
        } else {
            codeParts.push(value);
            descParts.push(value + (name === 'wattage' ? 'W' : ''));
        }
    }
    const finalCode = codeParts.join('');
    const finalDesc = descParts.join('');

    document.getElementById('itemCode').textContent = finalCode;
    document.getElementById('fullDesc').textContent = finalDesc;
    document.getElementById('output').style.display = 'block';
    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
}
function copyToClipboard(id) {
    const text = document.getElementById(id).textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        alert('Copied: ' + text);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => {
                console.log('Service Worker Registered successfully!');
            })
            .catch(err => {
                console.error('Service Worker registration failed:', err);
            });
    });
}
