document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('article-form');
  const articlesContainer = document.getElementById('articles');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    const description = document.getElementById('description').value;
    const stock = document.getElementById('stock').value;
    const price = document.getElementById('price').value;

    try {
      const response = await fetch('/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, description, stock, price })
      });
      const data = await response.json();
      console.log(data);
      // Actualizar la lista de artículos después de registrar uno nuevo
      fetchArticles();
    } catch (error) {
      console.error('Error al registrar el artículo:', error);
    }
  });

  async function fetchArticles() {
    try {
      const response = await fetch('/articles');
      const data = await response.json();
      articlesContainer.innerHTML = `
        <table>
          ><thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Precio</th>
              <thAcciones</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      `;
      const tbody = articlesContainer.querySelector('tbody');
      data.forEach(article => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${article.code}</td>
          <td>${article.description}</td>
          <td>${article.stock}</td>
          <td>$${article.price}</td>
          <td>
            <button onclick="deleteArticle(${article.code})">Eliminar</button>
            <button onclick="editArticle(${article.code})">Editar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
    }
  }

  window.deleteArticle = async (code) => {
    try {
      const response = await fetch(`/articles/${code}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log(data);
      fetchArticles();
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  }

  window.editArticle = (code) => {
    const article = prompt('Ingrese los nuevos datos del artículo (Descripción, Stock, Precio):');
    if (article) {
      const [description, stock, price] = article.split(',');
      updateArticle(code, description.trim(), stock.trim(), price.trim());
    }
  }

  async function updateArticle(code, description, stock, price) {
    try {
      const response = await fetch(`/articles/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, stock, price })
      });
      const data = await response.json();
      console.log(data);
      fetchArticles();
    } catch (error) {
      console.error('Error al actualizar el artículo:', error);
    }
  }

  // Obtener y mostrar los artículos al cargar la página
  fetchArticles();
});
