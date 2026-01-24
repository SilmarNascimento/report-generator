FROM maven:3.9.6-eclipse-temurin-21

WORKDIR /app

# Variável de ambiente para o Maven não spamar logs
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"

# Copia apenas o pom para cachear dependências
COPY pom.xml .

# Truque: go-offline falha as vezes.
# dependency:resolve garante dependências e plugins
# O cache do Docker vai pular essa etapa se o pom.xml não mudar
RUN mvn dependency:go-offline -B && mvn dependency:resolve-plugins dependency:resolve

# NÃO fazemos COPY . . aqui para desenvolvimento.
# O código será injetado via Volume (Bind Mount) no docker-compose.
# Isso torna o startup instantâneo.

EXPOSE 8080 5005

# O comando de execução padrão
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-Dmaven.test.skip=true"]