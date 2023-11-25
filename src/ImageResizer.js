import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const ImageResizer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resizedImageUrl, setResizedImageUrl] = useState('');
    const [originalDimensions, setOriginalDimensions] = useState(null);
    const [resizedDimensions, setResizedDimensions] = useState(null);
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [loading, setLoading] = useState(false);
    const [showImage, setShowImage] = useState(true);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            setOriginalDimensions({
                width: image.width,
                height: image.height,
            });
        };
    };

    const handleResize = async () => {
        try {
            setLoading(true);
            setShowImage(false);

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('width', width);
            formData.append('height', height);

            const response = await axios.post('https://rescaling-image-springboot-rescaling-image-springboot.up.railway.app/resize-no-aspect-ratio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'arraybuffer',
            });

            const resizedImageBlob = new Blob([response.data]);
            const resizedImageUrl = URL.createObjectURL(resizedImageBlob);

            setTimeout(() => {
                setLoading(false);
                setShowImage(true);

                const resizedImage = new Image();
                resizedImage.src = resizedImageUrl;
                resizedImage.onload = () => {
                    setResizedImageUrl(resizedImageUrl);
                    setResizedDimensions({
                        width: resizedImage.width,
                        height: resizedImage.height,
                    });
                };
            }, 500);
        } catch (error) {
            console.error('Error al redimensionar la imagen', error);
            setLoading(false);
            setShowImage(true);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = resizedImageUrl;
        link.download = 'resized_image.jpg';
        link.click();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-700 rounded shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-center">Cambiar tamaño de imagen</h1>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Seleccionar imagen:</label>
                    <label className="w-full flex items-center justify-center bg-gray-800 rounded-md py-2 px-4 border border-gray-300 cursor-pointer">
                        <svg
                            className="w-6 h-6 text-gray-300 mr-2 transform rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            ></path>
                        </svg>
                        <span className="text-gray-300">Seleccionar archivo</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                <div className="mb-4 flex">
                    <div className="w-1/2 pr-2">
                        <label className="block text-sm mb-2">Ancho:</label>
                        <input
                            type="text"
                            placeholder="Ancho"
                            className="w-full p-2 border rounded-md border-gray-300 text-black"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2 pl-2">
                        <label className="block text-sm mb-2">Altura:</label>
                        <input
                            type="text"
                            placeholder="Altura"
                            className="w-full p-2 border rounded-md border-gray-300 text-black"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    onClick={handleResize}
                >
                    Redimensionar
                </button>

                {loading && (
                    <div className="flex items-center justify-center mt-4">
                        <ClipLoader color="#4CAF50" loading={loading} size={35} />
                    </div>
                )}

                {showImage && resizedImageUrl && (
                    <div className="flex items-center justify-center mt-4">
                        <div>
                            <p className="mb-2 text-center">Imagen redimensionada:</p>
                            <img src={resizedImageUrl} alt="Resized" className="rounded" />
                        </div>
                    </div>
                )}

                {originalDimensions && (
                    <p className="text-center mt-4">Dimensiones originales: {originalDimensions.width} x {originalDimensions.height}</p>
                )}
                {resizedDimensions && (
                    <p className="text-center">Dimensiones redimensionadas: {resizedDimensions.width} x {resizedDimensions.height}</p>
                )}

                {resizedImageUrl && (
                    <div className="mt-4 text-center">
                        <button
                            className="bg-green-500 text-white p-2 rounded"
                            onClick={handleDownload}
                        >
                            Descargar Imagen
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageResizer;
