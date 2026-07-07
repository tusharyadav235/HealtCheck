const API_BASE = '/api';
let authHeader = '';

// Auth
document.getElementById('loginBtn').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    authHeader = 'Basic ' + btoa(user + ':' + pass);
    
    fetch(`${API_BASE}/admin/bookings`, { headers: { 'Authorization': authHeader } })
        .then(res => {
            if (res.ok) {
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('loginError').style.display = 'none';
                loadAllData();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        })
        .catch(err => {
            document.getElementById('loginError').style.display = 'block';
            console.error(err);
        });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    authHeader = '';
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
    });
});

// Load Data
function loadAllData() {
    loadBookings();
    loadDoctors();
    loadGallery();
    loadTestimonials();
    loadPackages();
}

function loadBookings() {
    fetch(`${API_BASE}/admin/bookings`, { headers: { 'Authorization': authHeader } })
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('bookingsTableBody');
            tbody.innerHTML = '';
            data.forEach(b => {
                tbody.innerHTML += `
                    <tr>
                        <td>${b.id}</td>
                        <td>${b.patientName}</td>
                        <td>${b.department}</td>
                        <td>${b.doctorName}</td>
                        <td>${b.appointmentDate}</td>
                        <td>${b.timeSlot}</td>
                        <td><button class="btn-delete" onclick="deleteItem('bookings', ${b.id})">Delete</button></td>
                    </tr>
                `;
            });
        });
}

function loadDoctors() {
    fetch(`${API_BASE}/public/doctors`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('doctorsPreview');
            container.innerHTML = '';
            data.forEach(d => {
                container.innerHTML += `
                    <div class="preview-item">
                        <img src="${d.imageUrl}" alt="${d.name}">
                        <div class="preview-info">
                            <h4>${d.name}</h4>
                            <p>${d.specialization}</p>
                        </div>
                        <button class="preview-delete" onclick="deleteItem('doctors', ${d.id})">&times;</button>
                    </div>
                `;
            });
        });
}

function loadGallery() {
    fetch(`${API_BASE}/public/gallery`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('galleryPreview');
            container.innerHTML = '';
            data.forEach(g => {
                container.innerHTML += `
                    <div class="preview-item">
                        <img src="${g.imageUrl}" alt="${g.altText}">
                        <div class="preview-info">
                            <h4>${g.altText}</h4>
                        </div>
                        <button class="preview-delete" onclick="deleteItem('gallery', ${g.id})">&times;</button>
                    </div>
                `;
            });
        });
}

function loadTestimonials() {
    fetch(`${API_BASE}/public/testimonials`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('testimonialsPreview');
            container.innerHTML = '';
            data.forEach(t => {
                const img = t.imageUrl ? `<img src="${t.imageUrl}" alt="${t.patientName}">` : '<div style="height:100px;background:#ddd;display:flex;align-items:center;justify-content:center;">No Image</div>';
                container.innerHTML += `
                    <div class="preview-item">
                        ${img}
                        <div class="preview-info">
                            <h4>${t.patientName}</h4>
                            <p>${t.starRating} Stars</p>
                        </div>
                        <button class="preview-delete" onclick="deleteItem('testimonials', ${t.id})">&times;</button>
                    </div>
                `;
            });
        });
}

function loadPackages() {
    fetch(`${API_BASE}/public/packages`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('packagesPreview');
            if (!container) return;
            container.innerHTML = '';
            data.forEach(p => {
                container.innerHTML += `
                    <div class="preview-item" style="padding:1rem;">
                        <div class="preview-info">
                            <h4>${p.title}</h4>
                            <p style="font-weight:bold; margin: 0.5rem 0; color:var(--text-primary);">₹${p.price}</p>
                            <p style="margin-bottom:0.5rem;">${p.features.split(',').join('<br>')}</p>
                            ${p.premium ? '<span style="color:#0d9488; font-size:0.8rem; font-weight:bold;">PREMIUM</span>' : ''}
                        </div>
                        <button class="preview-delete" onclick="deleteItem('packages', ${p.id})">&times;</button>
                    </div>
                `;
            });
        });
}

function deleteItem(type, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`${API_BASE}/admin/${type}/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': authHeader }
        }).then(res => {
            if(res.ok) loadAllData();
        });
    }
}

// Forms Submissions
document.getElementById('doctorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('docName').value);
    formData.append('specialization', document.getElementById('docSpec').value);
    formData.append('yearsOfExperience', document.getElementById('docExp').value);
    formData.append('image', document.getElementById('docImage').files[0]);

    fetch(`${API_BASE}/admin/doctors`, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
    }).then(res => {
        if(res.ok) {
            e.target.reset();
            loadDoctors();
        }
    });
});

document.getElementById('galleryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('altText', document.getElementById('galAlt').value);
    formData.append('image', document.getElementById('galImage').files[0]);

    fetch(`${API_BASE}/admin/gallery`, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
    }).then(res => {
        if(res.ok) {
            e.target.reset();
            loadGallery();
        }
    });
});

document.getElementById('testimonialForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('patientName', document.getElementById('testName').value);
    formData.append('quote', document.getElementById('testQuote').value);
    formData.append('starRating', document.getElementById('testStars').value);
    if(document.getElementById('testImage').files[0]) {
        formData.append('image', document.getElementById('testImage').files[0]);
    }

    fetch(`${API_BASE}/admin/testimonials`, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
    }).then(res => {
        if(res.ok) {
            e.target.reset();
            loadTestimonials();
        }
    });
});

document.getElementById('packageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('pkgTitle').value);
    formData.append('price', document.getElementById('pkgPrice').value);
    formData.append('features', document.getElementById('pkgFeatures').value);
    formData.append('isPremium', document.getElementById('pkgPremium').checked);

    fetch(`${API_BASE}/admin/packages`, {
        method: 'POST',
        headers: { 'Authorization': authHeader },
        body: formData
    }).then(res => {
        if(res.ok) {
            e.target.reset();
            loadPackages();
        }
    });
});
