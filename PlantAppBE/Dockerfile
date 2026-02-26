# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file
COPY ["PlantAppBE.csproj", "./"]

# Restore dependencies
RUN dotnet restore "PlantAppBE.csproj"

# Copy the entire project
COPY . .

# Build the application
RUN dotnet build "PlantAppBE.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "PlantAppBE.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published application
COPY --from=publish /app/publish .

# Expose port (adjust if needed)
EXPOSE 5000
EXPOSE 5001

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000;https://+:5001
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "PlantAppBE.dll"]
