.PHONY: help run dev test build build-community build-macos clean check check-all lint

help:
	@echo "QvReader Open Source Commands:"
	@echo "  make dev             - Launch desktop client in development mode (opens sample.md)"
	@echo "  make test            - Run frontend and native tests"
	@echo "  make check-all       - Run sequential all-check pipeline (test, typecheck, build, locked cargo test)"
	@echo "  make build           - Build Community edition package"
	@echo "  make build-community - Build Community edition desktop app"
	@echo "  make build-macos     - Package macOS DMG installer"
	@echo "  make lint            - Typecheck and validate source"
	@echo "  make clean           - Remove build artifacts and caches"

dev:
	@npm run tauri dev -- "test-fixtures/sample.md"

run: dev

test:
	@npm run test -- --run
	@cargo test --manifest-path src-tauri/Cargo.toml --locked

lint:
	@npm run lint

check: check-all

check-all:
	@echo "1/4 Running frontend unit tests..."
	@npm run test -- --run
	@echo "2/4 Typechecking and building frontend dist..."
	@npm run build
	@echo "3/4 Running locked native Rust test suite..."
	@cargo test --manifest-path src-tauri/Cargo.toml --locked
	@echo "4/4 Validating source boundary..."
	@chmod +x scripts/verify-source-boundary.sh && ./scripts/verify-source-boundary.sh
	@echo "✅ All public checks passed!"

build: build-community

build-community:
	@npm run build
	@cargo build --release --manifest-path src-tauri/Cargo.toml --no-default-features --features custom-protocol

build-macos:
	@chmod +x scripts/build-macos.sh && ./scripts/build-macos.sh

clean:
	@rm -rf dist src-tauri/target
