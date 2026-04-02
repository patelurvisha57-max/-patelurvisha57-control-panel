/**
 * 1. FORM DISPLAY LOGIC
 * ડ્રોપડાઉનમાંથી આઈટમ પસંદ કરતા સંબંધિત ફોર્મ બતાવવા માટે.
 */
function showForm(itemId) {
    // બધા ફોર્મ સેક્શન પહેલા છુપાવી દો
    document.querySelectorAll('.form-section').forEach(form => {
        form.style.display = 'none';
    });
    
    // આઉટપુટ (Item Code) સેક્શન પણ છુપાવી દો
    document.getElementById('output').style.display = 'none';

    // જો કોઈ ચોક્કસ આઈટમ સિલેક્ટ કરી હોય, તો તેને બતાવો
    if (itemId) {
        const selectedForm = document.getElementById(itemId);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }
    }
}

/**
 * 2. DYNAMIC INPUTS FOR CAST HEATER
 * શેપ (Band, Plate વગેરે) મુજબ અલગ-અલગ ડાયમેન્શન બોક્સ બતાવવા માટે.
 */
function showTextboxes() {
    const category = document.getElementById('category').value;
    const container = document.getElementById('textboxContainer');
    
    // જૂના ટેક્સ્ટબોક્સ સાફ કરો
    container.innerHTML = ''; 

    if (!category) return;

    let fields = [];
    // શેપ મુજબ ફિલ્ડ નક્કી કરો
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

/**
 * 3. CODE & DESCRIPTION GENERATION
 * ફોર્મ સબમિટ થાય ત્યારે કોડ જનરેટ કરવા માટે.
 */
function generateCode(event, prefix, itemLabel) {
    event.preventDefault(); // પેજ રિફ્રેશ થતું અટકાવો
    
    const form = event.target;
    const formData = new FormData(form);
    
    let codeParts = [prefix];
    let descParts = [itemLabel];

    // ફોર્મમાં ભરેલી દરેક વિગત તપાસો
    for (let [name, value] of formData.entries()) {
        if (!value) continue;

        const element = form.querySelector(`[name="${name}"]`);
        
        // જો તે ડ્રોપડાઉન (Select) હોય, તો તેનું આખું નામ (data-full) લો
        if (element && element.tagName === 'SELECT') {
            const selectedOption = element.options[element.selectedIndex];
            const fullText = selectedOption.getAttribute('data-full') || value;
            
            codeParts.push(value);
            descParts.push(fullText);
        } else {
            // જો તે ઇનપુટ બોક્સ હોય (જેમ કે Wattage)
            codeParts.push(value);
            descParts.push(value + (name === 'wattage' ? 'W' : ''));
        }
    }

    // રિઝલ્ટ તૈયાર કરો
    const finalCode = codeParts.join('-');
    const finalDesc = descParts.join(' / ');

    // HTML માં ડેટા બતાવો
    document.getElementById('itemCode').textContent = finalCode;
    document.getElementById('fullDesc').textContent = finalDesc;
    document.getElementById('output').style.display = 'block';
    
    // નીચે સ્ક્રોલ કરો જેથી યુઝરને કોડ દેખાય
    document.getElementById('output').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 4. COPY TO CLIPBOARD
 * બટન ક્લિક કરતા ટેક્સ્ટ કોપી કરવા માટે.
 */
function copyToClipboard(id) {
    const text = document.getElementById(id).textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        alert('Copied: ' + text);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

/**
 * 5. PWA SERVICE WORKER REGISTRATION
 * એપને ઓફલાઇન અને ઇન્સ્ટોલેબલ બનાવવા માટે.
 */
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