.PHONY: help run dev test build build-community build-macos build-linux build-windows clean check check-all lint install-cli

help:
	@echo "QvReader Open Source Client Commands:"
	@echo "  make dev             - Launch desktop client in development mode (opens sample.md)"
	@echo "  make test            - Run frontend and native tests"
	@echo "  make check-all       - Run sequential quality pipeline (preflight, test, build, locked cargo test)"
	@echo "  make build           - Build application packages for current platform (./scripts/build-client.sh)"
	@echo "  make build-macos     - Package macOS DMG installer and app bundle"
	@echo "  make build-linux     - Package Linux .deb and .AppImage packages"
	@echo "  make build-windows   - Package Windows .exe (NSIS) and .msi packages"
	@echo "  make install-cli     - Register \`qvreader\` terminal command"
	@echo "  make lint            - Typecheck and validate source"
	@echo "  make clean           - Remove build artifacts and caches (dist, dist-artifacts, target)"

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
	@echo "1/5 Running toolchain preflight checks..."
	@chmod +x scripts/verify-prerequisites.sh && ./scripts/verify-prerequisites.sh
	@echo "2/5 Running frontend unit tests..."
	@npm run test -- --run
	@echo "3/5 Typechecking and building frontend dist..."
	@npm run build
	@echo "4/5 Running locked native Rust test suite..."
	@cargo test --manifest-path src-tauri/Cargo.toml --locked
	@echo "5/5 Validating source boundary..."
	@chmod +x scripts/verify-source-boundary.sh && ./scripts/verify-source-boundary.sh
	@echo "✅ All public client checks passed!"

build:
	@chmod +x scripts/build-client.sh && ./scripts/build-client.sh

build-community: build

build-macos:
	@chmod +x scripts/build-macos.sh && ./scripts/build-macos.sh

build-linux:
	@chmod +x scripts/build-linux.sh && ./scripts/build-linux.sh

build-windows:
	@chmod +x scripts/build-windows.sh && ./scripts/build-windows.sh

install-cli:
	@chmod +x scripts/install-cli.sh && ./scripts/install-cli.sh

clean:
	@rm -rf dist dist-artifacts src-tauri/target
