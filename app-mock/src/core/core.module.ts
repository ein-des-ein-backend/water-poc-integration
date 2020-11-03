import { Module } from "@nestjs/common";
import { SapMessageService } from "./services/sap-message.service";

@Module({
    imports: [],
    providers: [SapMessageService],
    exports: [SapMessageService]
})
export class CoreModule {}