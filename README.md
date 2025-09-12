# DriveAcademy-Manager

C 2024 ZHUNG - DriveAcademy Manager v1.0

# 駕駛訓練學校學員管理系統

## 請先創建該項目的虛擬環境：
### 建立 windows python 虛擬環境：
```
python -m venv venv
```
#### 啟動虛擬環境：
```
venv\Scripts\activate
```
#### 安裝項目所需的套件：
```
pip install -r requirements.txt
```
#### 若要離開虛擬環境：
```
deactivate
```
---
### 建立 macos python 虛擬環境：
```
python3 -m venv venv
```
#### 啟動虛擬環境：
```
source venv/bin/activate
```
#### 安裝項目所需的套件：
```
pip install -r requirements.txt
```
#### 若要離開虛擬環境：
```
deactivate
```
---
 3. 安裝專案依賴套件
     打開命令提示字元（CMD）或 PowerShell，並 cd
  進入您的專案資料夾。然後執行以下命令來安裝所有必要的函式庫：

   1    pip install -r requirements.txt



  4. 安裝 PyInstaller
     您的 requirements.txt 中沒有包含 pyinstaller，所以需要手動安裝它：

   1    pip install pyinstaller



  5. 執行打包命令
     一切準備就緒後，在同一個命令提示字元視窗中，執行以下命令來開始打包：

   1    pyinstaller DriveAcademy.spec


  6. 找到您的應用程式
     PyInstaller 會建立幾個資料夾。打包完成後，您會在專案目錄下找到一個名為 dist 的資料夾。


     在 dist 資料夾裡面，您會找到一個名為 佑名駕訓班-測試版V1.0 的資料夾，其中包含了您的 .exe
  執行檔以及所有相關的依賴檔案。您可以將整個 佑名駕訓班-測試版V1.0 資料夾複製到任何 Windows 10
  電腦上來運行您的應用程式。