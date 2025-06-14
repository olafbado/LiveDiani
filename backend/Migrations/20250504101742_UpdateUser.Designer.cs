﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250504101742_UpdateUser")]
    partial class UpdateUser
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CategoryId")
                        .HasColumnType("integer");

                    b.Property<int?>("CreatedByUserId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("LocationId")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("LocationId");

                    b.ToTable("Events");
                });

            modelBuilder.Entity("backend.Models.EventCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("EventCategories");
                });

            modelBuilder.Entity("backend.Models.EventPhoto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("EventId")
                        .HasColumnType("integer");

                    b.Property<bool>("IsMain")
                        .HasColumnType("boolean");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("EventPhotos");
                });

            modelBuilder.Entity("backend.Models.EventTag", b =>
                {
                    b.Property<int>("EventId")
                        .HasColumnType("integer");

                    b.Property<int>("TagId")
                        .HasColumnType("integer");

                    b.HasKey("EventId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("EventTags");
                });

            modelBuilder.Entity("backend.Models.FavoriteEvent", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<int>("EventId")
                        .HasColumnType("integer");

                    b.Property<int?>("EventId1")
                        .HasColumnType("integer");

                    b.HasKey("UserId", "EventId");

                    b.HasIndex("EventId");

                    b.HasIndex("EventId1");

                    b.ToTable("FavoriteEvents");
                });

            modelBuilder.Entity("backend.Models.Location", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasColumnType("text");

                    b.Property<double?>("Latitude")
                        .HasColumnType("double precision");

                    b.Property<double?>("Longitude")
                        .HasColumnType("double precision");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("backend.Models.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.HasOne("backend.Models.EventCategory", "Category")
                        .WithMany("Events")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "CreatedByUser")
                        .WithMany("CreatedEvents")
                        .HasForeignKey("CreatedByUserId");

                    b.HasOne("backend.Models.Location", "Location")
                        .WithMany("Events")
                        .HasForeignKey("LocationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("CreatedByUser");

                    b.Navigation("Location");
                });

            modelBuilder.Entity("backend.Models.EventPhoto", b =>
                {
                    b.HasOne("backend.Models.Event", "Event")
                        .WithMany("Photos")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");
                });

            modelBuilder.Entity("backend.Models.EventTag", b =>
                {
                    b.HasOne("backend.Models.Event", "Event")
                        .WithMany("EventTags")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.Tag", "Tag")
                        .WithMany("EventTags")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("backend.Models.FavoriteEvent", b =>
                {
                    b.HasOne("backend.Models.Event", "Event")
                        .WithMany()
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.Event", null)
                        .WithMany("FavoritedBy")
                        .HasForeignKey("EventId1");

                    b.HasOne("backend.Models.User", "User")
                        .WithMany("FavoriteEvents")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.Event", b =>
                {
                    b.Navigation("EventTags");

                    b.Navigation("FavoritedBy");

                    b.Navigation("Photos");
                });

            modelBuilder.Entity("backend.Models.EventCategory", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("backend.Models.Location", b =>
                {
                    b.Navigation("Events");
                });

            modelBuilder.Entity("backend.Models.Tag", b =>
                {
                    b.Navigation("EventTags");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Navigation("CreatedEvents");

                    b.Navigation("FavoriteEvents");
                });
#pragma warning restore 612, 618
        }
    }
}
