#!/bin/bash

# Script para baixar NOVOS vídeos globais (Agribusiness) do Pexels
# Estes vídeos são 100% diferentes dos originais do Brasil.
# Executar na raiz do projeto platform-v2

VIDEO_DIR="public/videos"
mkdir -p $VIDEO_DIR

echo "Iniciando download de NOVOS vídeos globais para $VIDEO_DIR..."

# 1. Iowa, EUA - Campo de Trigo/Milho (Diferente da Colheitadeira)
echo "Baixando: Iowa Field (Novo)..."
curl -L -o "$VIDEO_DIR/global-harvest.mp4" "https://www.pexels.com/video/856694/download"

# 2. Rotterdam, Holanda - Terminal de Containers (Hamburgo Style - Diferente do Porto Santos)
echo "Baixando: Rotterdam/Hamburg Terminal (Novo)..."
curl -L -o "$VIDEO_DIR/global-port.mp4" "https://www.pexels.com/video/35562080/download"

# 3. Califórnia, EUA - Campos Verdes/Irrigação (Diferente do Pivot Central)
echo "Baixando: California Fields (Novo)..."
curl -L -o "$VIDEO_DIR/global-irrigation.mp4" "https://www.pexels.com/video/29138093/download"

# 4. Hamburgo, Alemanha - Caminhão na Estrada (Diferente da Ponte)
echo "Baixando: Hamburg Truck (Novo)..."
curl -L -o "$VIDEO_DIR/global-truck.mp4" "https://www.pexels.com/video/4320049/download"

# 5. Saskatchewan, Canadá - Trigo ao Pôr do Sol (Diferente dos Silos de Metal)
echo "Baixando: Canada Wheat Sunset (Novo)..."
curl -L -o "$VIDEO_DIR/global-silos.mp4" "https://www.pexels.com/video/19003436/download"

# 6. Cingapura - Cientista Homem (Diferente da Cientista Mulher)
echo "Baixando: Singapore Scientist (Novo)..."
curl -L -o "$VIDEO_DIR/global-lab.mp4" "https://www.pexels.com/video/8771135/download"

echo "---------------------------------------------------"
echo "Download concluído! Os arquivos foram substituídos por versões ÚNICAS."
echo "Tamanho dos arquivos baixados:"
ls -lh $VIDEO_DIR/global-*.mp4
