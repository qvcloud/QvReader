use std::fs;

#[test]
fn test_roundtrip_preservation() {
    let test_data = "# Line 1\r\nLine 2\r\n- Item 1\r\n- Item 2\r\n";
    let tmp_path = std::env::temp_dir().join("qvreader_test.md");
    fs::write(&tmp_path, test_data.as_bytes()).unwrap();

    let bytes = fs::read(&tmp_path).unwrap();
    assert_eq!(bytes, test_data.as_bytes());

    let _ = fs::remove_file(tmp_path);
}
