document.addEventListener('DOMContentLoaded', () => {
    const blogsGrid = document.getElementById('blogsGrid');
    const searchInput = document.getElementById('searchInput');
    let blogsData = [];

    // Verileri yükleme fonksiyonu
    async function loadBlogs() {
        try {
            // Statik sitemizde json dosyasından veriyi asenkron olarak çekiyoruz.
            // İleride GitHub reposuna yüklediğinizde bu kod aynen çalışmaya devam edecektir.
            const response = await fetch('blogs.json');

            if (!response.ok) {
                throw new Error('Blog verileri yüklenemedi.');
            }

            blogsData = await response.json();
            renderBlogs(blogsData);
        } catch (error) {
            console.error('Hata:', error);
            blogsGrid.innerHTML = `
                <div class="no-results">
                    <i class='bx bx-error-circle' style='font-size: 48px; margin-bottom: 16px; color: #94a3b8;'></i>
                    <p>Blog yazıları yüklenirken bir sorun oluştu veya henüz blog eklemediniz.</p>
                </div>
            `;
        }
    }

    // Blogları ekrana çizme fonksiyonu
    function renderBlogs(blogs) {
        blogsGrid.innerHTML = '';

        if (blogs.length === 0) {
            blogsGrid.innerHTML = `
                <div class="no-results">
                    <i class='bx bx-search' style='font-size: 48px; margin-bottom: 16px; color: #94a3b8;'></i>
                    <p>Aradığınız kriterlere uygun blog yazısı bulunamadı.</p>
                </div>
            `;
            return;
        }

        blogs.forEach(blog => {
            const card = document.createElement('div');
            card.className = 'blog-card';

            const tagsHtml = blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            card.innerHTML = `
                <div class="blog-date"><i class='bx bx-calendar' style='margin-right: 6px; vertical-align: middle;'></i>${blog.date}</div>
                <h2 class="blog-title">${blog.title}</h2>
                <p class="blog-excerpt">${blog.excerpt}</p>
                <div class="blog-tags">
                    ${tagsHtml}
                </div>
            `;

            // Eğer bir URL varsa tıklanınca o blog içeriğine yönlendirebilirsiniz
            card.addEventListener('click', () => {
                if (blog.url) {
                    window.location.href = blog.url;
                } else {
                    alert('Bu yazının detayı henüz eklenmemiştir.');
                }
            });

            blogsGrid.appendChild(card);
        });
    }

    // Arama fonksiyonu
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        const filteredBlogs = blogsData.filter(blog => {
            const hasHiddenTag = blog.hiddenTags && blog.hiddenTags.some(tag => tag.toLowerCase().includes(searchTerm));
            return blog.title.toLowerCase().includes(searchTerm) ||
                blog.excerpt.toLowerCase().includes(searchTerm) ||
                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                hasHiddenTag;
        });

        renderBlogs(filteredBlogs);
    });

    // Başlangıçta blogları yükle
    loadBlogs();
});
