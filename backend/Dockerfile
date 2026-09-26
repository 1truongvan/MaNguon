## ===== Stage 1: Build =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy file project và restore package
COPY *.csproj ./
RUN dotnet restore

# Copy toàn bộ source code
COPY . .

# Publish project ở chế độ Release
RUN dotnet publish -c Release -o /app/publish

## ===== Stage 2: Run =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy file đã publish
COPY --from=build /app/publish .

# Render sẽ chạy cổng 8080
ENV ASPNETCORE_URLS=http://+:8080

EXPOSE 8080

# Thay EWarrantySystem.dll bằng tên DLL của project nếu khác
ENTRYPOINT ["dotnet", "EWarrantySystem.dll"]