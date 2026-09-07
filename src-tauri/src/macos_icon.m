#import <Cocoa/Cocoa.h>

void set_macos_dock_icon(const unsigned char *bytes, unsigned long length) {
    @autoreleasepool {
        NSData *data = [NSData dataWithBytes:bytes length:length];
        NSImage *image = [[NSImage alloc] initWithData:data];
        if (image) {
            [NSApp setApplicationIconImage:image];
        }
    }
}

static char g_open_path_buf[4096] = {0};

const char* show_macos_open_panel() {
    g_open_path_buf[0] = '\0';
    void (^block)(void) = ^{
        @autoreleasepool {
            NSOpenPanel *panel = [NSOpenPanel openPanel];
            [panel setCanChooseFiles:YES];
            [panel setCanChooseDirectories:YES];
            [panel setAllowsMultipleSelection:NO];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            [panel setAllowedFileTypes:@[@"md", @"markdown", @"mdown", @"mkd", @"mkdn", @"mdx", @"txt"]];
#pragma clang diagnostic pop
            if ([panel runModal] == NSModalResponseOK) {
                NSURL *url = [[panel URLs] firstObject];
                if (url && [url path]) {
                    const char *p = [[url path] UTF8String];
                    if (p) {
                        strncpy(g_open_path_buf, p, sizeof(g_open_path_buf) - 1);
                    }
                }
            }
        }
    };
    if ([NSThread isMainThread]) {
        block();
    } else {
        dispatch_sync(dispatch_get_main_queue(), block);
    }
    return g_open_path_buf[0] != '\0' ? g_open_path_buf : NULL;
}

static char g_save_path_buf[4096] = {0};

const char* show_macos_save_panel(const char *default_name) {
    g_save_path_buf[0] = '\0';
    void (^block)(void) = ^{
        @autoreleasepool {
            NSSavePanel *panel = [NSSavePanel savePanel];
            [panel setCanCreateDirectories:YES];
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
            [panel setAllowedFileTypes:@[@"md", @"markdown"]];
#pragma clang diagnostic pop
            if (default_name) {
                [panel setNameFieldStringValue:[NSString stringWithUTF8String:default_name]];
            }
            if ([panel runModal] == NSModalResponseOK) {
                NSURL *url = [panel URL];
                if (url && [url path]) {
                    const char *p = [[url path] UTF8String];
                    if (p) {
                        strncpy(g_save_path_buf, p, sizeof(g_save_path_buf) - 1);
                    }
                }
            }
        }
    };
    if ([NSThread isMainThread]) {
        block();
    } else {
        dispatch_sync(dispatch_get_main_queue(), block);
    }
    return g_save_path_buf[0] != '\0' ? g_save_path_buf : NULL;
}

void reveal_in_macos_finder(const char *path) {
    if (!path) return;
    @autoreleasepool {
        NSString *nsPath = [NSString stringWithUTF8String:path];
        [[NSWorkspace sharedWorkspace] selectFile:nsPath inFileViewerRootedAtPath:@""];
    }
}

