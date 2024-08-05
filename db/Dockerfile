FROM postgres:13-alpine

# Copiar o script de inicialização para o diretório de inicialização do Docker
COPY init.sql /docker-entrypoint-initdb.d/
