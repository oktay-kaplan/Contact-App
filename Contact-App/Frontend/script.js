let allPersons = [];
const form = document.getElementById('rehberForm');



form.addEventListener('submit', function (event) {
    event.preventDefault();

    const yeniKisi = {
        fName: document.getElementById('firstName').value,
        lName: document.getElementById('lastName').value,
        number: document.getElementById('phoneNumber').value,
    };

    fetch('http://localhost:8080/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(yeniKisi),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hatası! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(eklenenKisi => {
            console.log('Yeni kişi eklendi:', eklenenKisi);

            document.getElementById('alertContainer').innerHTML = `
                <div class="alert alert-success" role="alert">
                    İşleminiz gerçekleşmiştir, rehberiniz güncel hali için Rehberi Listele butonuna basınız.
                </div>
            `;

            setTimeout(function () {
                document.getElementById('alertContainer').innerHTML = '';
            }, 3000);

        })
        .catch(error => {
            console.error('Hata:', error.message);
        });
});


//GET İSTEĞİ!!!
document.getElementById('getButton').addEventListener('click', function () {
    fetch('http://localhost:8080/contact')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hatası! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#dataTable tbody');
            tableBody.innerHTML = '';

            const allPersons = data;

            data.forEach(person => {
                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${person.id}</td>
                        <td>${person.fName}</td>
                        <td>${person.lName}</td>
                        <td>${person.number}</td>
                        <td><button class="editButton" data-id="${person.id}">Düzenle</button></td>
                        <td><button class="deleteButton" data-id="${person.id}">Sil</button></td>
                    `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.deleteButton').forEach(button => {
                button.addEventListener('click', function () {
                    const personId = this.getAttribute('data-id');
                    handleDeletePerson(personId);
                });
            });
            document.querySelectorAll('.editButton').forEach(button => {
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    const personId = this.getAttribute('data-id');
                    console.log('Düzenle butonuna basıldı. Kişi ID:', personId);
                    handleEditPerson(personId, allPersons);
                });
            });
        })
        .catch(error => {
            console.error('Hata:', error.message);
        });
});


function handleEditPerson(personId, dataList) {
    const selectedPerson = dataList.find(person => person.id === personId);

    document.getElementById('firstName').value = selectedPerson.fName;
    document.getElementById('lastName').value = selectedPerson.lName;
    document.getElementById('phoneNumber').value = selectedPerson.number;
    document.getElementById('personId').value = selectedPerson.id;


    editPerson(personId);
}



//DELETE İSTEĞİ!!!!!
function handleDeletePerson(personId) {
    fetch(`http://localhost:8080/contact/${personId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hatası! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(result => {
            console.log('Silme işlemi başarılı:', result);



            document.getElementById('alertContainer').innerHTML = `
                <div class="alert alert-success" role="alert">
                    Kişi ,rehberinizden başarıyla silinmiştir.
                </div>
            `;

            setTimeout(function () {
                document.getElementById('alertContainer').innerHTML = '';
            }, 2000);

            document.getElementById('getButton').click();
        })
        .catch(error => {
            console.error('Hata:', error.message);
        });
}


//EDİT İSTEĞİ!!!!!
function editPerson(personId) {
    fetch(`http://localhost:8080/contact/${personId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP hatası! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(result => {
            console.log('edit işlemi başarılı:', result);

            document.getElementById('alertContainer').innerHTML = `
                <div class="alert alert-success" role="alert">
                    Rehberinizdeki kişinin bilgilerini aşağıdan güncelleyebilirsiniz.
                </div>
            `;

            setTimeout(function () {
                document.getElementById('alertContainer').innerHTML = '';
            }, 3000);

            document.getElementById('getButton').click();
        })
        .catch(error => {
            console.error('Hata:', error.message);
        });
}


