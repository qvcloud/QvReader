================================================================================
  QvReader - macOS 安装与信任运行说明 (Installation & Trust Guidance)
================================================================================

【中文指引】
感谢您下载 QvReader！
由于 QvReader 为独立开源软件，尚未接入昂贵的商业代码签名证书，首次在 macOS 上运行时
系统 Gatekeeper 可能会弹出「无法打开，因为无法验证开发者」或「已损坏，无法打开」的提示。
软件本身 100% 纯净开源、安全无害。请通过以下任一方法即可正常打开：

▶ 方法一：访达右键打开（最简便）
  1. 将 QvReader 拖入右侧的「Applications (应用程序)」文件夹。
  2. 在访达的「应用程序」中找到 QvReader，按住 Control 键或右键单击图标，选择「打开」。
  3. 在弹出的安全警告对话框中，再次点击「打开」按钮即可永久信任运行。

▶ 方法二：系统设置解除拦截（macOS 15 Sequoia 推荐）
  1. 正常双击 QvReader 图标，若弹出阻止提示，点击好或取消。
  2. 打开 Mac「系统设置」-> 点击左侧「隐私与安全性」。
  3. 滚动到右侧「安全性」部分，会看到「已阻止使用 QvReader...」。
  4. 点击其右侧的「仍要打开」按钮，输入锁屏密码确认即可。

▶ 方法三：终端一条命令一键清除隔离标记（彻底解决「已损坏」）
  打开 Mac 自带的「终端 (Terminal)」App，粘贴并执行以下命令按回车：
  
    xattr -cr /Applications/QvReader.app

  说明：该命令仅移除系统针对下载文件打上的隔离属性（com.apple.quarantine），
  不会修改系统安全策略或任何系统文件。

官方网站: https://qvreader.com
开源仓库: https://github.com/qvcloud/QvReader

--------------------------------------------------------------------------------

[English Guidance]
Thank you for downloading QvReader!
As an open-source project without expensive commercial Apple Developer certificates,
macOS Gatekeeper may show a warning: "cannot be opened because the developer cannot
be verified" or "is damaged and cannot be opened". The application is 100% clean and safe.
Please follow any of the methods below to open it:

▶ Method 1: Right-Click Open (Recommended)
  1. Drag QvReader into the Applications folder.
  2. In Finder -> Applications, hold Control or right-click QvReader, then select "Open".
  3. Click "Open" in the security prompt to permanently trust the app.

▶ Method 2: System Settings > Privacy & Security (macOS 15 Sequoia)
  1. Double-click QvReader. If blocked, close the prompt.
  2. Open macOS "System Settings" -> "Privacy & Security".
  3. Scroll down to the "Security" section to locate the notice about QvReader.
  4. Click "Open Anyway" and enter your password if prompted.

▶ Method 3: Terminal Command (Resolves "app is damaged")
  Open the Terminal app and execute:

    xattr -cr /Applications/QvReader.app

  This safely removes the quarantine attribute (com.apple.quarantine) applied by macOS.

Official Website: https://qvreader.com
Open Source Repo: https://github.com/qvcloud/QvReader
================================================================================
