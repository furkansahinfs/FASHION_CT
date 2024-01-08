import { Controller, UseGuards } from "@nestjs/common";
import { CTOrderService } from "src/services";
import { Roles } from "src/util";
import { RolesGuard } from "src/middleware";
import { MessagePattern } from "@nestjs/microservices";
import { ROLES } from "src/enums";
import { CreateOrderPayload, GetOrdersFilterPayload } from "src/dto";

@Controller()
export class CTOrderController {
  constructor(protected readonly ctOrderService: CTOrderService) {}

  @MessagePattern({ role: "orders", cmd: "get" })
  @Roles(ROLES.ADMIN, ROLES.CT_ADMIN)
  @UseGuards(RolesGuard)
  async getOrders(payload: GetOrdersFilterPayload) {
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.getOrders(payload.dto);
  }

  @MessagePattern({ role: "orders", cmd: "get-me" })
  async getMyOrders(payload: GetOrdersFilterPayload) {
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.getMyOrders(payload.dto);
  }

  @MessagePattern({ role: "orders", cmd: "post" })
  async createOrder(payload: CreateOrderPayload) {
    console.log("xxx", payload);
    this.ctOrderService.setCTCustomer(payload.user.ct_customer_id);
    return await this.ctOrderService.createOrder(payload.dto);
  }
}
