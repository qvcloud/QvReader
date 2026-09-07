fn main() {
    #[cfg(target_os = "macos")]
    {
        cc::Build::new()
            .file("src/macos_icon.m")
            .flag("-fobjc-arc")
            .compile("macos_icon");
        println!("cargo:rerun-if-changed=src/macos_icon.m");
        println!("cargo:rustc-link-lib=framework=Cocoa");
        println!("cargo:rustc-link-lib=framework=AppKit");
    }
    tauri_build::build()
}
