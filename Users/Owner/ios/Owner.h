
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNOwnerSpec.h"

@interface Owner : NSObject <NativeOwnerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Owner : NSObject <RCTBridgeModule>
#endif

@end
