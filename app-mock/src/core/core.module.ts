import { Module } from "@nestjs/common";
import { SapMessageService } from "./sap-message.service";

@Module({
    imports: [],
    providers: [SapMessageService],
    exports: [SapMessageService]
})
export class CoreModule {}