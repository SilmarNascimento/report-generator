# Usar a imagem base do Maven com OpenJDK 17 para a etapa de construção
FROM maven:3-openjdk-17 as build-image

# Definir o diretório de trabalho para a etapa de construção
WORKDIR /to-build-app

# Copiar o arquivo pom.xml para baixar as dependências do Maven
COPY pom.xml .

# Baixar as dependências do Maven
RUN mvn dependency:go-offline

# Copiar o código-fonte para o diretório /src
COPY src ./src

# Compilar o código-fonte e criar o arquivo JAR
RUN mvn clean package

# Usar uma imagem Alpine com OpenJRE 17 para a imagem final
FROM eclipse-temurin:17-jre-alpine

# Definir o diretório de trabalho para a imagem final
WORKDIR /app-backend

# Copiar o arquivo JAR gerado na etapa de construção para o diretório /target
COPY --from=build-image /to-build-app/target/report-generator-API-0.0.1-SNAPSHOT.jar ./target/app.jar

# Expor a porta 8080 para acessar a aplicação
EXPOSE 8080

# Definir o ponto de entrada para iniciar a aplicação Spring Boot
ENTRYPOINT ["java", "-jar", "target/app.jar"]