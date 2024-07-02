 
"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Bounce, toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { GuestHouse, RoomType } from "@prisma/client";

const RoomSchema = z.object({
  totalBed: z
    .string()
    .regex(/^\d+$/, { message: "Total Bed must be a number" })
    .transform((val) => parseInt(val, 10)),
  totalRoom: z
    .string()
    .regex(/^\d+$/, { message: "Total Room must be a number" })
    .transform((val) => parseInt(val, 10)),
});

const ManageHotel = ({ roomDetails }: any) => {
  const [selectedGuestHouse, setSelectedGuestHouse] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [localRoomDetails, setLocalRoomDetails] = useState(roomDetails); // Local state to store room details

  const guestHouses = [
    {
      value: GuestHouse.SARAN_GUEST_HOUSE,
      name: "SARAN GUEST HOUSE",
    },
    {
      value: GuestHouse.VISVESVARAYA_GUEST_HOUSE,
      name: "VISVESVARAYA GUEST HOUSE",
    },
    {
      value: GuestHouse.EXECUTIVE_GUEST_HOUSE,
      name: "EXECUTIVE GUEST HOUSE",
    },
  ];

  const roomTypes = [
    {
      value: RoomType.SINGLE_BED,
      name: "Single",
    },
    {
      value: RoomType.DOUBLE_BED,
      name: "Double",
    },
    {
      value: RoomType.TRIPLE_BED,
      name: "Triple",
    },
  ];

  const filteredRoomDetails = localRoomDetails.filter(
    (room: any) => room.hostelName === selectedGuestHouse
  );

  const filteredRoomTypes = roomTypes.filter((roomType) =>
    filteredRoomDetails.some((room: any) => room.roomType === roomType.value)
  );

  const form = useForm({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      totalBed: "0",
      totalRoom: "0",
    },
  });

  const updateRoomMutation = api.room.updateRoomDetails.useMutation({
    onSuccess: (response: { updatedRoomDetails: any; }) => {
      const updatedRoom = response.updatedRoomDetails;
      // Update the local state with the new room details
      setLocalRoomDetails((prevDetails: any[]) =>
        prevDetails.map((room: { id: any }) =>
          room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
        )
      );
      toast("Successfully updated", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onError: (error: { message: any; }) => {
      toast.error(`Failed to update room: ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
  });

  useEffect(() => {
    if (selectedHostelId) {
      const room = filteredRoomDetails.find(
        (room: any) => room.id === selectedHostelId
      );
      if (room) {
        setSelectedRoomType(room.roomType);
        form.setValue("totalBed", room.totalBed?.toString() || "0");
        form.setValue("totalRoom", room.totalRoom?.toString() || "0");
      }
    }
  }, [selectedHostelId, filteredRoomDetails, form]);

  const onSubmit = (data: { totalBed: string; totalRoom: string }) => {
    updateRoomMutation.mutate({
      id: selectedHostelId,
      totalBed: parseInt(data.totalBed, 10),
      totalRoom: parseInt(data.totalRoom, 10),
    });
  };

  return (
    <section>
      <h1 className="text-center text-[2rem] font-bold">Manage Hotel Rooms</h1>
      <div className="my-3 border p-6 rounded">
        <div>
          <label htmlFor="guestHouse">Select Guest House:</label>
          <select
            id="guestHouse"
            value={selectedGuestHouse}
            onChange={(e) => {
              setSelectedGuestHouse(e.target.value);
              setSelectedRoomType(""); // Reset room type when guest house changes
              setSelectedHostelId(""); // Reset hostel id when guest house changes
            }}
            className="mt-2 block w-full border p-2"
          >
            <option value="">--Select Guest House--</option>
            {guestHouses.map((guestHouse) => (
              <option key={guestHouse.value} value={guestHouse.value}>
                {guestHouse.name}
              </option>
            ))}
          </select>
        </div>

        {selectedGuestHouse && (
          <div className="mt-3">
            <label htmlFor="roomType">Select Room Type:</label>
            <select
              id="roomType"
              value={selectedRoomType}
              onChange={(e) => {
                setSelectedRoomType(e.target.value);
                const room = filteredRoomDetails.find(
                  (r: any) => r.roomType === e.target.value
                );
                setSelectedHostelId(room?.id || "");
              }}
              className="mt-2 block w-full border p-2"
            >
              <option value="">--Select Room Type--</option>
              {filteredRoomTypes.map((roomType) => (
                <option key={roomType.value} value={roomType.value}>
                  {roomType.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedRoomType && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="totalBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Bed</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={field.onChange}
                        className="mt-2 block w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalRoom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Room</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={field.onChange}
                        className="mt-2 block w-full border p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="rounded bg-blue-500 p-2 text-white">
                Update
              </Button>
            </form>
          </Form>
        )}
      </div>
    </section>
  );
};

export default ManageHotel;
