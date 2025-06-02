const API_BASE_URL = '/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text()
        try {
            const json = JSON.parse(text)
            throw new Error(json.message || response.statusText)
        } catch {
            throw new Error(text || response.statusText)
        }
    }
    const text = await response.text()
    return text ? JSON.parse(text) : {}
}

export const api = {
    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/categories`);
        return handleResponse(response)
    },

    async createCategory(data) {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response)
    },

    async updateCategory(id, data) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response)
    },

    async deleteCategory(id) {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response)
    },

    async getArtifacts(categoryId = null) {
        const url = categoryId
            ? `${API_BASE_URL}/artifacts?categoryId=${categoryId}`
            : `${API_BASE_URL}/artifacts`;
        const response = await fetch(url);
        return handleResponse(response)
    },

    async createArtifact(data) {
        const response = await fetch(`${API_BASE_URL}/artifacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response)
    },

    async updateArtifact(id, data) {
        const response = await fetch(`${API_BASE_URL}/artifacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response)
    },

    async deleteArtifact(id) {
        const response = await fetch(`${API_BASE_URL}/artifacts/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response)
    },

    async getArtifactVersions(artifactId) {
        const response = await fetch(`${API_BASE_URL}/artifacts/${artifactId}/versions`);
        return handleResponse(response);
    },

    async addArtifactVersion(artifactId, versionData) {
        const response = await fetch(`${API_BASE_URL}/artifacts/${artifactId}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(versionData)
        });
        return handleResponse(response);
    },

    async deleteArtifactVersion(artifactId, versionId) {
        const response = await fetch(`${API_BASE_URL}/artifacts/${artifactId}/versions/${versionId}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    }
};