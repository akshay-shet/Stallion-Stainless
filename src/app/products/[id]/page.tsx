"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar, { SOFA_SUBSECTIONS } from "@/components/Sidebar";
import { getProductById, PRODUCTS, SOFA_FABRICS, getSofaConfigSpec, ConfigDetails, getProductImageForSeater, getProductModelForSeater, getProductSketchForSeater, getPriceForConfig } from "@/data/products";
import { ChevronRight, ChevronLeft, Star, ShoppingBag, Plus, Minus, Check, HelpCircle, View, X, Eye, Scan, Camera, QrCode, Smartphone, Sparkles, Copy, Ruler, RotateCcw, ArrowLeft } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const FABRIC_SWATCHES = SOFA_FABRICS;

const STEEL_FINISHES = [
  { name: "Golden", hex: "#D4AF37", image: "/gold_finish.png" },
  { name: "Pink", hex: "#B76E79", image: "/pink_finish.jpg" },
  { name: "Silver", hex: "#E6E6E6", image: "/silver_finish.png" },
  { name: "MDF", hex: "#C19A6B", image: "/mdf_finish.jpg" }
];

// Module-level GLTF cache to avoid re-downloading/re-parsing the 78MB model on each toggle
const gltfSceneCache = new Map<string, THREE.Group>();
const gltfTextureCache = new Map<
  string,
  { map?: THREE.Texture; normalMap?: THREE.Texture; roughnessMap?: THREE.Texture }
>();

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const product = getProductById(id);

  // Fallback if product not found
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-warm-ivory text-on-surface">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-24 px-6">
          <h1 className="font-display text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="font-sans text-on-surface-variant mb-6">The requested sofa collection does not exist.</p>
          <Link href="/collections" className="bg-charcoal-ink text-white font-sans text-label-caps py-3 px-6 rounded-sm uppercase tracking-wider text-xs">
            Back to Collections
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const seaterParam = searchParams.get("seater");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedConfig, setSelectedConfig] = useState(seaterParam || "Three Seater");

  useEffect(() => {
    if (seaterParam) {
      setSelectedConfig(seaterParam);
    }
  }, [seaterParam]);

  const [selectedFabric, setSelectedFabric] = useState(FABRIC_SWATCHES[0].name);
  const [selectedSteel, setSelectedSteel] = useState(STEEL_FINISHES[0].name);
  const [studioTab, setStudioTab] = useState<"3d" | "sketch" | "ar">("3d");
  const [showAR, setShowAR] = useState(false);
  const [arCameraActive, setArCameraActive] = useState(false);
  const [arCameraError, setArCameraError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || "";
      setIsMobileDevice(/iPhone|iPad|iPod|Android/i.test(ua));
      setIsAndroidDevice(/Android/i.test(ua));
    }
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Dynamic configuration details and 3D availability
  const currentConfig: ConfigDetails = getSofaConfigSpec(selectedConfig);
  const seaterModelUrl = product ? getProductModelForSeater(product, selectedConfig) : undefined;
  const hasConfig3D = Boolean(seaterModelUrl || (currentConfig.has3D && (currentConfig.modelUrl || (product as any).modelUrl)));
  const activeModelUrl = seaterModelUrl || (currentConfig.has3D ? (currentConfig.modelUrl || (product as any).modelUrl) : null);

  // AR functions: Live Camera AR
  const startCameraAR = async () => {
    setArCameraError(null);
    try {
      if (typeof window === "undefined" || typeof navigator === "undefined") return;

      const nav = navigator as any;
      const hasGetUserMedia = Boolean(
        window.isSecureContext &&
        nav.mediaDevices &&
        typeof nav.mediaDevices.getUserMedia === "function"
      );

      if (!hasGetUserMedia) {
        setArCameraError(
          isAndroidDevice
            ? "In-browser camera requires HTTPS. Tap 'Launch Android AR (Scene Viewer)' to view in native AR."
            : "Live camera AR requires a secure HTTPS connection. Please scan the QR code with your phone."
        );
        setShowAR(true);
        return;
      }

      if (!hasConfig3D) {
        setSelectedConfig("Three Seater");
      }
      const stream = await nav.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      mediaStreamRef.current = stream;
      setArCameraActive(true);
      setStudioTab("ar");
    } catch (err: any) {
      console.error("Camera access error:", err);
      setArCameraError(
        isAndroidDevice
          ? "Camera permission was not granted. Tap 'Launch Android AR (Scene Viewer)' below for native AR."
          : "Camera access could not be started. Please allow camera permissions in your browser or scan the QR Code."
      );
      setShowAR(true);
    }
  };

  const stopCameraAR = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setArCameraActive(false);
  };

  useEffect(() => {
    if (arCameraActive && mediaStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((e) => console.log(e));
    }
  }, [arCameraActive]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Auto-launch AR modal if URL parameter is present, and restore fabric / steel from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("ar") === "true" || params.get("ar") === "camera" || params.get("ar") === "1") {
        setShowAR(true);
      }
      const fab = params.get("fabric");
      if (fab && FABRIC_SWATCHES.some(f => f.name === fab)) {
        setSelectedFabric(fab);
      }
      const st = params.get("steel");
      if (st && STEEL_FINISHES.some(s => s.name === st)) {
        setSelectedSteel(st);
      }
    }
  }, []);

  // Synchronize URL with active seater configuration
  useEffect(() => {
    if (typeof window !== "undefined" && selectedConfig) {
      const url = new URL(window.location.href);
      if (url.searchParams.get("seater") !== selectedConfig) {
        url.searchParams.set("seater", selectedConfig);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [selectedConfig]);

  const getArUrl = () => {
    if (typeof window === "undefined") return "";
    let origin = window.location.origin;
    if (origin.includes("localhost")) {
      origin = origin.replace("localhost", "10.194.190.57");
    }
    return `${origin}/products/${id}?ar=true&fabric=${encodeURIComponent(selectedFabric)}&steel=${encodeURIComponent(selectedSteel)}&seater=${encodeURIComponent(selectedConfig)}`;
  };

  const handleCopyArLink = () => {
    const url = getArUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenSceneViewer = () => {
    if (typeof window === "undefined") return;
    let origin = window.location.origin;
    if (origin.includes("localhost")) {
      origin = origin.replace("localhost", "10.194.190.57");
    }
    const currentModel = activeModelUrl || "/models/sofa7.glb";
    const modelFullUrl = currentModel.startsWith("http") ? currentModel : `${origin}${currentModel}`;
    const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelFullUrl)}&mode=ar_only&title=${encodeURIComponent("Stallion Stainless " + (product?.name || "Luxury") + " Sofa")}&resizable=true#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
    window.location.href = sceneViewerUrl;
  };

  const [localReviews, setLocalReviews] = useState<any[]>([]);

  // Load local reviews for this product
  useEffect(() => {
    const saved = localStorage.getItem("stallion_reviews");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out legacy mock reviews
        const clean = parsed.filter((r: any) => r.id !== "mock-1" && r.id !== "mock-2");
        if (parsed.length !== clean.length) {
          localStorage.setItem("stallion_reviews", JSON.stringify(clean));
        }
        setLocalReviews(clean.filter((r: any) => r.productId === id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [id]);

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const defaultCamPosRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const fabricMaterialRef = useRef<THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial | null>(null);
  const metalMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const steelTexturesRef = useRef<Record<string, THREE.Texture>>({});

  const resetCameraView = () => {
    if (defaultCamPosRef.current && cameraRef.current && controlsRef.current) {
      cameraRef.current.position.copy(defaultCamPosRef.current.pos);
      controlsRef.current.target.copy(defaultCamPosRef.current.target);
      controlsRef.current.update();
    }
  };

  // Helper function to dynamically apply steel finish texture and physical metalness/roughness
  const applySteelFinish = (finishName: string) => {
    if (!metalMaterialRef.current) return;
    const mat = metalMaterialRef.current;
    const tex = steelTexturesRef.current[finishName];

    if (tex) {
      mat.map = tex;
      mat.color.set("#FFFFFF");
      tex.needsUpdate = true;
    } else {
      mat.map = null;
      if (finishName === "Golden") mat.color.set("#D4AF37");
      else if (finishName === "Pink") mat.color.set("#B76E79");
      else if (finishName === "Silver") mat.color.set("#E6E6E6");
      else if (finishName === "MDF") mat.color.set("#C19A6B");
    }

    if (finishName === "Golden") {
      mat.metalness = 0.95;
      mat.roughness = 0.15;
    } else if (finishName === "Pink") {
      mat.metalness = 0.90;
      mat.roughness = 0.20;
    } else if (finishName === "Silver") {
      mat.metalness = 0.98;
      mat.roughness = 0.08;
    } else if (finishName === "MDF") {
      mat.metalness = 0.05;
      mat.roughness = 0.85;
    }
    mat.needsUpdate = true;

    if (sceneRef.current) {
      sceneRef.current.traverse((child: any) => {
        if (child.isMesh) {
          const isMetal =
            child.name.toLowerCase().includes("metal") ||
            child.name.toLowerCase().includes("feet") ||
            child.name.toLowerCase().includes("leg") ||
            child.name.toLowerCase().includes("base") ||
            (child.material?.name && child.material.name.toLowerCase().includes("metal"));
          if (isMetal) {
            child.material = mat;
          }
        }
      });
    }
  };

  // Preload all steel finish textures on mount
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    STEEL_FINISHES.forEach(st => {
      if (!steelTexturesRef.current[st.name]) {
        loader.load(st.image, (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(3, 3);
          tex.colorSpace = THREE.SRGBColorSpace;
          steelTexturesRef.current[st.name] = tex;
          if (selectedSteel === st.name && metalMaterialRef.current) {
            applySteelFinish(st.name);
          }
        });
      }
    });
  }, []);

  // Sync selected configuration and fabric when product changes
  useEffect(() => {
    if (seaterParam) {
      setSelectedConfig(seaterParam);
    } else {
      setSelectedConfig("Three Seater");
    }
    if (product?.fabricName) {
      const match = FABRIC_SWATCHES.find(
        (f) => f.name.toLowerCase() === product.fabricName?.toLowerCase()
      );
      if (match) {
        setSelectedFabric(match.name);
      } else {
        setSelectedFabric(FABRIC_SWATCHES[0].name);
      }
    } else {
      setSelectedFabric(FABRIC_SWATCHES[0].name);
    }
  }, [product, seaterParam]);

  // Filter out the current product for similar choices
  const similarProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  // Initialize 3D Viewer inside useEffect
  useEffect(() => {
    if (!canvasRef.current || !activeModelUrl) return;
    let isMounted = true;

    const container = canvasRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.8, 2.2, 4.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Environment Reflections for Realistic Metallic Sheen
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv).texture;
    scene.environment = envTexture;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.7, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // don't go below floor
    controls.minDistance = 2.0;
    controls.maxDistance = 9.0;
    controlsRef.current = controls;

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd0d0d0, 1.3);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf5f5f5, 0.8);
    fillLight.position.set(-6, 5, -4);
    scene.add(fillLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    // Soft Ground Contact Shadow
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 25, 128, 128, 120);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.32)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.12)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(5.4, 3.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.005, 0);
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // Robust function to frame and center any model regardless of shape/proportions
    const frameModelInScene = (modelObj: THREE.Object3D) => {
      // 1. Initial measurement of raw model
      const initialBox = new THREE.Box3().setFromObject(modelObj);
      const initialSize = initialBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(initialSize.x, initialSize.y, initialSize.z);

      // Normalize scale so the model spans comfortably in standard 3D space
      const targetScale = maxDim > 0 ? 4.0 / maxDim : 1;
      modelObj.scale.setScalar(targetScale);

      // 2. Center horizontally and place base flush with ground (y = 0)
      const scaledBox = new THREE.Box3().setFromObject(modelObj);
      const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

      modelObj.position.x = -scaledCenter.x;
      modelObj.position.y = -scaledBox.min.y;
      modelObj.position.z = -scaledCenter.z;

      // 3. Final measured box after positioning
      const finalBox = new THREE.Box3().setFromObject(modelObj);
      const finalSize = finalBox.getSize(new THREE.Vector3());
      const finalCenter = finalBox.getCenter(new THREE.Vector3());

      // Center the controls target exactly on the visual and geometric center of the sofa
      const targetY = Math.max(0.35, finalCenter.y);
      controls.target.set(0, targetY, 0);

      // Size ground shadow to match the actual footprint of the sofa
      shadowMesh.position.set(0, 0.003, 0);
      shadowMesh.scale.set(
        Math.max(1.2, finalSize.x * 0.32),
        Math.max(1.2, finalSize.z * 0.45),
        1
      );

      // 4. Calculate camera distance to frame the model perfectly in the viewport
      const fovRad = camera.fov * (Math.PI / 180);
      const aspect = camera.aspect || (width / height);

      // Radius of bounding sphere around the sofa
      const sphere = finalBox.getBoundingSphere(new THREE.Sphere());
      const radius = Math.max(sphere.radius, 1.6);

      // Distance required to fit both height and width with balanced margin
      const distVertical = radius / Math.sin(fovRad / 2);
      const distHorizontal = radius / (Math.sin(fovRad / 2) * aspect);
      const fitDistance = Math.max(distVertical, distHorizontal) * 1.20; // 20% breathing room

      // Camera angles: ~21 degrees elevation, ~42 degrees azimuth
      const elevation = 0.37;
      const azimuth = Math.PI / 4.3;

      const eyeY = targetY + fitDistance * Math.sin(elevation);
      const groundDist = fitDistance * Math.cos(elevation);
      const eyeX = groundDist * Math.sin(azimuth);
      const eyeZ = groundDist * Math.cos(azimuth);

      camera.position.set(eyeX, eyeY, eyeZ);
      camera.near = fitDistance / 50;
      camera.far = fitDistance * 20;
      camera.updateProjectionMatrix();

      controls.minDistance = fitDistance * 0.35;
      controls.maxDistance = fitDistance * 3.0;
      controls.update();

      defaultCamPosRef.current = {
        pos: camera.position.clone(),
        target: controls.target.clone()
      };
    };

    // Materials Initialization
    const selectedFabricObj = FABRIC_SWATCHES.find(f => f.name === selectedFabric) || FABRIC_SWATCHES[0];

    const metalMaterial = new THREE.MeshStandardMaterial({
      metalness: selectedSteel === "MDF" ? 0.05 : 0.95,
      roughness: selectedSteel === "MDF" ? 0.85 : 0.15,
    });
    metalMaterialRef.current = metalMaterial;
    applySteelFinish(selectedSteel);

    const fabricMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedFabricObj.hex),
      roughness: 0.8,
      metalness: 0.02,
      sheen: 0.8,
      sheenColor: new THREE.Color(selectedFabricObj.hex),
      sheenRoughness: 0.45,
    });
    fabricMaterialRef.current = fabricMaterial;

    const modelUrl = activeModelUrl;

    if (modelUrl) {
      const cachedScene = gltfSceneCache.get(modelUrl);
      if (cachedScene) {
        const model = cachedScene.clone(true);
        const textures = gltfTextureCache.get(modelUrl);
        if (textures?.map) fabricMaterial.map = textures.map;
        if (textures?.normalMap) {
          fabricMaterial.normalMap = textures.normalMap;
          fabricMaterial.normalScale.set(0.7, 0.7);
        }
        if (textures?.roughnessMap) fabricMaterial.roughnessMap = textures.roughnessMap;
        fabricMaterial.needsUpdate = true;

        model.traverse((child: any) => {
          if (child.isMesh) {
            const isMetal =
              child.name.toLowerCase().includes("metal") ||
              child.name.toLowerCase().includes("feet") ||
              child.name.toLowerCase().includes("leg") ||
              child.name.toLowerCase().includes("base") ||
              (child.material?.name && child.material.name.toLowerCase().includes("metal"));
            child.material = isMetal ? metalMaterial : fabricMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        frameModelInScene(model);
        scene.add(model);
        setIsModelLoading(false);
      } else {
        setIsModelLoading(true);
        setLoadProgress(0);

        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            if (!isMounted) return;
            gltfSceneCache.set(modelUrl, gltf.scene);

            let textures = gltfTextureCache.get(modelUrl);
            if (!textures) {
              let map: THREE.Texture | undefined;
              let normalMap: THREE.Texture | undefined;
              let roughnessMap: THREE.Texture | undefined;
              gltf.scene.traverse((child: any) => {
                if (child.isMesh && child.material) {
                  const mat = child.material;
                  if (!map && mat.map) map = mat.map;
                  if (!normalMap && mat.normalMap) normalMap = mat.normalMap;
                  if (!roughnessMap && mat.roughnessMap) roughnessMap = mat.roughnessMap;
                }
              });
              textures = { map, normalMap, roughnessMap };
              gltfTextureCache.set(modelUrl, textures);
            }

            if (textures.map) {
              textures.map.wrapS = THREE.RepeatWrapping;
              textures.map.wrapT = THREE.RepeatWrapping;
              fabricMaterial.map = textures.map;
            }
            if (textures.normalMap) {
              textures.normalMap.wrapS = THREE.RepeatWrapping;
              textures.normalMap.wrapT = THREE.RepeatWrapping;
              fabricMaterial.normalMap = textures.normalMap;
              fabricMaterial.normalScale.set(0.7, 0.7);
            }
            if (textures.roughnessMap) {
              textures.roughnessMap.wrapS = THREE.RepeatWrapping;
              textures.roughnessMap.wrapT = THREE.RepeatWrapping;
              fabricMaterial.roughnessMap = textures.roughnessMap;
            }
            fabricMaterial.needsUpdate = true;

            gltf.scene.traverse((child: any) => {
              if (child.isMesh) {
                const isMetal =
                  child.name.toLowerCase().includes("metal") ||
                  child.name.toLowerCase().includes("feet") ||
                  child.name.toLowerCase().includes("leg") ||
                  child.name.toLowerCase().includes("base") ||
                  (child.material?.name && child.material.name.toLowerCase().includes("metal"));
                child.material = isMetal ? metalMaterial : fabricMaterial;
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            frameModelInScene(gltf.scene);
            scene.add(gltf.scene);
            setIsModelLoading(false);
          },
          (xhr) => {
            if (!isMounted) return;
            if (xhr.total > 0) {
              setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
            }
          },
          (err) => {
            console.error("Error loading GLTF model:", err);
            if (isMounted) setIsModelLoading(false);
          }
        );
      }
    }

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler via ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      pmremGenerator.dispose();
      roomEnv.dispose();
      envTexture.dispose();
      controls.dispose();
      renderer.dispose();
      sceneRef.current = null;
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeModelUrl]);

  // Synchronize fabric selection in real-time with 3D model
  useEffect(() => {
    if (fabricMaterialRef.current) {
      const selectedFabricObj = FABRIC_SWATCHES.find(f => f.name === selectedFabric) || FABRIC_SWATCHES[0];
      const color = new THREE.Color(selectedFabricObj.hex);
      fabricMaterialRef.current.color.copy(color);
      if ("sheenColor" in fabricMaterialRef.current && (fabricMaterialRef.current as any).sheenColor) {
        (fabricMaterialRef.current as any).sheenColor.copy(color);
      }
      fabricMaterialRef.current.needsUpdate = true;
    }
  }, [selectedFabric]);

  // Synchronize steel / base finish selection in real-time with 3D model
  useEffect(() => {
    applySteelFinish(selectedSteel);
  }, [selectedSteel]);

  // Get fabric image source from selected fabric swatch
  const selectedFabricObj = FABRIC_SWATCHES.find(f => f.name === selectedFabric) || FABRIC_SWATCHES[0];
  const fabricImgSrc = selectedFabricObj?.image || product.fabricImage;

  const selectedSteelObj = STEEL_FINISHES.find(s => s.name === selectedSteel) || STEEL_FINISHES[0];
  const steelImgSrc = selectedSteelObj?.image;

  // Compute displayImages: H.jpg is always index 0, followed by all collection images
  const displayImages = (() => {
    if (product?.images && product.images.length > 0) {
      return [...product.images];
    }
    return ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600"];
  })();

  const has3D = !!(product as any).modelUrl || !!(product as any).seaterModels;
  const totalSlides = displayImages.length;

  // Swipe & Drag state for main gallery image view
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isSwipingHoriz = useRef<boolean | null>(null);
  const touchStartTime = useRef<number>(0);

  const safeActiveIdx = Math.min(activeImageIdx, Math.max(0, totalSlides - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalSlides <= 1) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    touchStartTime.current = Date.now();
    setIsDragging(true);
    isSwipingHoriz.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null || !isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    if (isSwipingHoriz.current === null) {
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        isSwipingHoriz.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isSwipingHoriz.current) {
      // Elastic resistance at edges
      let offset = diffX;
      if ((safeActiveIdx === 0 && diffX > 0) || (safeActiveIdx === totalSlides - 1 && diffX < 0)) {
        offset = diffX * 0.3;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const elapsed = Date.now() - touchStartTime.current;
    const isQuickFlick = elapsed < 300 && Math.abs(dragOffset) > 25;
    const isPastThreshold = Math.abs(dragOffset) > 45;

    if (isSwipingHoriz.current && (isQuickFlick || isPastThreshold)) {
      if (dragOffset < 0) {
        // Swiped left -> next
        setActiveImageIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      } else if (dragOffset > 0) {
        // Swiped right -> prev
        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
      }
    }

    setDragOffset(0);
    setTouchStartX(null);
    setTouchStartY(null);
    isSwipingHoriz.current = null;
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (totalSlides <= 1) return;
    setTouchStartX(e.clientX);
    touchStartTime.current = Date.now();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX === null || !isDragging) return;
    const diffX = e.clientX - touchStartX;
    let offset = diffX;
    if ((safeActiveIdx === 0 && diffX > 0) || (safeActiveIdx === totalSlides - 1 && diffX < 0)) {
      offset = diffX * 0.3;
    }
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const elapsed = Date.now() - touchStartTime.current;
    const isQuickFlick = elapsed < 300 && Math.abs(dragOffset) > 25;
    const isPastThreshold = Math.abs(dragOffset) > 45;

    if (isQuickFlick || isPastThreshold) {
      if (dragOffset < 0) {
        setActiveImageIdx((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      } else if (dragOffset > 0) {
        setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
      }
    }

    setDragOffset(0);
    setTouchStartX(null);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleColorChange = (color: typeof product.colors[0], idx: number) => {
    setSelectedColor(color);
    setActiveImageIdx(0); // Reset index to prevent overflow
  };

  const handleAddToCart = () => {
    if (!product) return;
    const selectedFabricObj = FABRIC_SWATCHES.find(f => f.name === selectedFabric) || FABRIC_SWATCHES[0];
    const cartItem = {
      id: `${product.id}-${selectedFabric.replace(/\s+/g, "-")}-${selectedSteel}-${selectedConfig.replace(/\s+/g, "-")}`,
      productId: product.id,
      name: product.name,
      color: selectedFabric,
      colorHex: selectedFabricObj.hex || selectedFabricObj.image,
      configuration: selectedConfig,
      steelFinish: selectedSteel,
      quantity: quantity,
      price: getPriceForConfig(product.price, selectedConfig),
      tagline: product.tagline,
      image: displayImages[0] || product.images[0]
    };

    const existingCartRaw = localStorage.getItem("stallion_cart");
    let existingCart = [];
    if (existingCartRaw) {
      try {
        existingCart = JSON.parse(existingCartRaw);
      } catch (e) {
        existingCart = [];
      }
    }

    const existingIndex = existingCart.findIndex((item: any) => item.id === cartItem.id);
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("stallion_cart", JSON.stringify(existingCart));
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      router.push("/cart");
    }, 800);
  };

  const matchingSubsection = SOFA_SUBSECTIONS.find(
    (s) => s.name.toLowerCase() === selectedConfig?.toLowerCase() || s.id === selectedConfig?.toLowerCase()
  ) || SOFA_SUBSECTIONS[2];

  const currentConfigIndex = SOFA_SUBSECTIONS.findIndex(
    (s) => s.id === matchingSubsection.id
  );

  const handleSelectConfig = (cfgName: string) => {
    setSelectedConfig(cfgName);
  };

  const handleShiftModel = (direction: "next" | "prev") => {
    const validIdx = currentConfigIndex >= 0 ? currentConfigIndex : 2;
    const newIndex = direction === "next"
      ? (validIdx + 1) % SOFA_SUBSECTIONS.length
      : (validIdx - 1 + SOFA_SUBSECTIONS.length) % SOFA_SUBSECTIONS.length;
    handleSelectConfig(SOFA_SUBSECTIONS[newIndex].name);
  };

  const activeSketchUrl = product
    ? getProductSketchForSeater(product, selectedConfig)
    : currentConfig.schematicImage;

  const currentActiveImg = displayImages[activeImageIdx] || "";
  const isHImage = Boolean(
    currentActiveImg && (
      currentActiveImg.toLowerCase().includes("/h.jpg") ||
      currentActiveImg.toLowerCase().includes("/h.png") ||
      currentActiveImg.toLowerCase().endsWith("h.jpg") ||
      currentActiveImg.toLowerCase().endsWith("h.png")
    )
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-background overflow-x-hidden w-full">
      <Header />

      <div className="flex flex-1 relative w-full min-w-0 overflow-x-hidden">
        {/* Desktop SideNavBar */}
        <div className="hidden lg:block w-64 flex-shrink-0 border-r border-stainless-silver bg-warm-ivory z-40">
          <Sidebar
            selectedCategory="sofa"
            selectedConfig={selectedConfig}
            onSelectConfig={setSelectedConfig}
            currentProductId={product.id}
          />
        </div>

        {/* Mobile SideNavBar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Slide drawer */}
            <div className="relative w-72 max-w-[85vw] bg-warm-ivory h-full shadow-2xl z-10 flex flex-col">
              <div className="p-4 border-b border-stainless-silver flex items-center justify-between">
                <span className="font-sans text-xs uppercase font-bold tracking-wider text-charcoal-ink">
                  Navigation & Subsections
                </span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-stone-200 rounded-sm cursor-pointer text-charcoal-ink"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  selectedCategory="sofa"
                  selectedConfig={selectedConfig}
                  onSelectConfig={(cfg) => {
                    setSelectedConfig(cfg);
                    setMobileSidebarOpen(false);
                  }}
                  currentProductId={product.id}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
          <main className="flex-grow px-3 sm:px-6 md:pl-12 md:pr-20 py-4 md:py-12 min-w-0 w-full max-w-container-max mx-auto overflow-x-hidden">
        {/* Android / Mobile Top Bar: Return Back Button (<-) and Product Name ONLY */}
        <div className="flex md:hidden items-center gap-3 mb-3 w-full">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
              } else {
                router.push("/collections");
              }
            }}
            className="w-9 h-9 rounded-full bg-white border border-stone-300 text-charcoal-ink hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center shadow-2xs shrink-0 cursor-pointer"
            aria-label="Return back"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal-ink" />
          </button>
          <h1 className="font-display text-lg xs:text-xl font-bold text-charcoal-ink uppercase tracking-wider truncate">
            {product.name}
          </h1>
        </div>

        {/* Desktop Breadcrumbs: [Home] [Collections] [Subsection] [Product Name] */}
        <div className="hidden md:flex mb-8 items-center justify-between gap-3 flex-wrap">
          <nav className="flex items-center gap-2 text-on-surface-variant font-sans text-xs tracking-wider uppercase overflow-x-auto whitespace-nowrap pb-1">
            <Link href="/" className="hover:text-charcoal-ink transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            <Link href="/collections" className="hover:text-charcoal-ink transition-colors">Collections</Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            <Link href={`/collections/${matchingSubsection.id}`} className="hover:text-charcoal-ink transition-colors">
              {matchingSubsection.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
            <span className="text-charcoal-ink font-semibold">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Section: Photo Gallery & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16 items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4 items-stretch h-fit max-w-2xl w-full mx-auto lg:mx-0">
            {/* Main Display Area (Image View) with Smooth Swipe & Animation */}
            <div
              className="relative w-full aspect-[3/2] bg-warm-ivory/50 border border-stainless-silver overflow-hidden rounded-sm group select-none touch-pan-y cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Sliding Track for All Images */}
              <div
                className="flex w-full h-full"
                style={{
                  transform: `translateX(calc(-${safeActiveIdx * 100}% + ${dragOffset}px))`,
                  transition: isDragging ? "none" : "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {displayImages.map((img, idx) => {
                  const isSlideH = Boolean(
                    img && (
                      img.toLowerCase().includes("/h.jpg") ||
                      img.toLowerCase().includes("/h.png") ||
                      img.toLowerCase().endsWith("h.jpg") ||
                      img.toLowerCase().endsWith("h.png")
                    )
                  );
                  return (
                    <div
                      key={idx}
                      className={`w-full h-full shrink-0 flex items-center justify-center select-none ${
                        isSlideH ? "p-0" : "p-3 md:p-6"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} View ${idx + 1}`}
                        draggable={false}
                        className={`w-full h-full select-none pointer-events-none ${
                          isSlideH
                            ? "object-cover object-center"
                            : "object-contain object-center"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Slider Navigation Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = safeActiveIdx === 0 ? totalSlides - 1 : safeActiveIdx - 1;
                      setActiveImageIdx(newIdx);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-charcoal-ink flex items-center justify-center shadow-md transition-all z-30 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newIdx = safeActiveIdx === totalSlides - 1 ? 0 : safeActiveIdx + 1;
                      setActiveImageIdx(newIdx);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-charcoal-ink flex items-center justify-center shadow-md transition-all z-30 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
                    {displayImages.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          safeActiveIdx === dotIdx
                            ? "w-5 bg-charcoal-ink"
                            : "w-1.5 bg-charcoal-ink/35"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Image Cart / Thumbnails (Directly Below Image View) */}
            <div className="flex flex-row gap-3 overflow-x-auto w-full pb-2 scrollbar-thin">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 md:w-24 md:h-24 shrink-0 border-2 p-1.5 focus:outline-none rounded-sm transition-all relative bg-warm-ivory/30 ${
                    safeActiveIdx === idx ? "border-charcoal-ink shadow-xs ring-1 ring-charcoal-ink" : "border-stainless-silver hover:border-charcoal-ink"
                  }`}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain object-center select-none pointer-events-none"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Order */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Desktop Header: Title, Tagline, & Star Reviews */}
            <div className="hidden lg:block border-b border-stainless-silver pb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-charcoal-ink mb-3">{product.name}</h1>
              <p className="font-sans text-sm text-stone-500 italic mb-4">{product.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                {(() => {
                  const hasReviews = localReviews.length > 0;
                  const avgRating = hasReviews
                    ? parseFloat((localReviews.reduce((acc, curr) => acc + curr.rating, 0) / localReviews.length).toFixed(1))
                    : 5.0;
                  return (
                    <div className="flex items-center gap-1 text-sm">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const isGold = idx < Math.round(avgRating);
                        return (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${isGold ? "fill-charcoal-ink text-charcoal-ink" : "text-stone-300"}`}
                          />
                        );
                      })}
                      <span className="text-on-surface-variant text-xs underline ml-1 cursor-pointer">
                        {hasReviews ? `(${localReviews.length} review${localReviews.length > 1 ? 's' : ''})` : "(No reviews yet)"}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Current Customization Selection Pill (Mobile: 2 lines) */}
            <div className="flex lg:hidden flex-col gap-2 p-2.5 bg-warm-ivory border border-stainless-silver rounded-sm">
              {/* Line 1: Three seater, Aris Champagne velvet, Golden Base in one line */}
              <div className="flex items-center gap-1.5 text-[11px] font-sans overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 w-full">
                <span className="px-1.5 py-0.5 bg-charcoal-ink text-white font-bold rounded-xs text-[9px] tracking-wider uppercase shrink-0">
                  {selectedConfig}
                </span>
                <span className="text-stone-300 shrink-0">•</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-3 h-3 rounded-full border border-black/15 shadow-inner shrink-0" style={{ backgroundColor: selectedFabricObj.hex }} />
                  <span className="font-semibold text-charcoal-ink text-[11px]">{selectedFabric}</span>
                </div>
                <span className="text-stone-300 shrink-0">•</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-3 h-3 rounded-full border border-black/15 shadow-inner shrink-0" style={{ backgroundColor: selectedSteelObj.hex }} />
                  <span className="font-semibold text-stone-700 text-[11px]">{selectedSteel} Base</span>
                </div>
              </div>
              {/* Line 2: Customize in 3D */}
              <div className="pt-1.5 border-t border-stainless-silver/60">
                <a href="#studio-customizer" className="text-[11px] font-sans font-semibold text-charcoal-ink underline hover:text-stone-600 inline-flex items-center gap-1">
                  Customize in 3D ↓
                </a>
              </div>
            </div>

            {/* Current Customization Selection Pill (Desktop) */}
            <div className="hidden lg:flex bg-warm-ivory border border-stainless-silver p-3 rounded-sm flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                <span className="px-2 py-0.5 bg-charcoal-ink text-white font-bold rounded-xs text-[10px] tracking-wider uppercase">
                  {selectedConfig}
                </span>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: selectedFabricObj.hex }} />
                  <span className="font-semibold text-charcoal-ink">{selectedFabric}</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner" style={{ backgroundColor: selectedSteelObj.hex }} />
                  <span className="font-semibold text-stone-700">{selectedSteel} Base</span>
                </div>
              </div>
              <a href="#studio-customizer" className="text-[11px] font-sans font-semibold text-charcoal-ink underline hover:text-stone-600 shrink-0">
                Customize in 3D ↓
              </a>
            </div>

            {/* Actions: Quantity & Single Cart Button */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center border border-stainless-silver rounded-sm bg-surface shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 sm:p-3 hover:bg-surface-container-low transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 sm:px-4 text-sm font-sans font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 sm:p-3 hover:bg-surface-container-low transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-charcoal-ink text-white font-sans text-label-caps py-3.5 sm:py-4 hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 rounded-sm uppercase tracking-wider text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="h-4 w-4" /> {added ? "Added ✓" : "Add to Cart"}
                </button>
              </div>

              {/* 5 star reviews below add to cart (Mobile view only) */}
              <div className="flex lg:hidden items-center gap-1 text-sm pt-1">
                {(() => {
                  const hasReviews = localReviews.length > 0;
                  const avgRating = hasReviews
                    ? parseFloat((localReviews.reduce((acc, curr) => acc + curr.rating, 0) / localReviews.length).toFixed(1))
                    : 5.0;
                  return (
                    <>
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const isGold = idx < Math.round(avgRating);
                        return (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${isGold ? "fill-charcoal-ink text-charcoal-ink" : "text-stone-300"}`}
                          />
                        );
                      })}
                      <span className="text-on-surface-variant text-xs underline ml-1 cursor-pointer">
                        {hasReviews ? `(${localReviews.length} review${localReviews.length > 1 ? 's' : ''})` : "(No reviews yet)"}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Product Details & Materials (Desktop only here - on mobile moved after 3D Studio) */}
            <div className="hidden lg:block mt-4 pt-4 border-t border-stainless-silver">
              <h3 className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-ink mb-3">
                Product Details & Materials
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-on-surface-variant font-sans text-xs leading-relaxed">
                {product.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
                <li>Anti-termite treated wood core</li>
                <li>Double stitch tailoring seams</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive 3D & AR Studio + Live Customizer Section (Adjusted Side-by-Side) */}
        {has3D && (
          <section id="studio-customizer" className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-stainless-silver scroll-mt-24">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="hidden lg:block text-[10px] font-sans uppercase tracking-widest text-stone-500 font-bold">
                  Virtual Showroom & Live Customizer
                </span>
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-ink">
                  Interactive 3D & AR Studio
                </h2>
              </div>
              <p className="hidden lg:block font-sans text-xs text-stone-500 max-w-md">
                Select your preferred upholstery fabric and steel base finish right here to preview real-time materials on the 3D model, or place directly in your space with AR.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start w-full min-w-0">
              {/* Left: 3D & AR Studio Viewport (lg:col-span-7) */}
              <div className="lg:col-span-7 flex flex-col w-full max-w-2xl mx-auto lg:mx-0 min-w-0">
                {/* Studio Header Bar with Toggle Controls (Mobile: stacked / grid so it never overflows) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-warm-ivory border border-stainless-silver px-3 sm:px-4 py-2.5 sm:py-3 rounded-t-sm w-full min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-charcoal-ink animate-pulse" />
                    <h3 className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-ink">
                      Studio Viewport
                    </h3>
                  </div>

                  {/* Toggle Controls: 3D Model vs 2D Sketch vs AR View */}
                  <div className="grid grid-cols-3 sm:flex rounded-sm p-0.5 bg-stone-200/80 border border-stone-300 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (arCameraActive) stopCameraAR();
                        setStudioTab("3d");
                      }}
                      className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-sans font-semibold rounded-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                        studioTab === "3d"
                          ? "bg-white text-charcoal-ink shadow-xs"
                          : "text-stone-600 hover:text-charcoal-ink"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">3D Model</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (arCameraActive) stopCameraAR();
                        setStudioTab("sketch");
                      }}
                      className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-sans font-semibold rounded-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                        studioTab === "sketch"
                          ? "bg-white text-charcoal-ink shadow-xs"
                          : "text-stone-600 hover:text-charcoal-ink"
                      }`}
                    >
                      <Ruler className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">2D Sketch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudioTab("ar")}
                      className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-sans font-semibold rounded-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                        studioTab === "ar"
                          ? "bg-white text-charcoal-ink shadow-xs"
                          : "text-stone-600 hover:text-charcoal-ink"
                      }`}
                    >
                      <Scan className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">AR View</span>
                    </button>
                  </div>
                </div>

                {/* Studio Viewport (Aspect-[3/2] Frame Identical to Image View) */}
                <div className={`relative w-full aspect-[3/2] ${arCameraActive ? "bg-black" : "bg-warm-ivory"} border border-stainless-silver border-t-0 overflow-hidden rounded-b-sm flex items-center justify-center`}>
                  {/* ThreeJS Container */}
                  <div
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing ${
                      studioTab === "3d" || arCameraActive ? "z-10 opacity-100 pointer-events-auto" : "z-0 opacity-0 pointer-events-none"
                    }`}
                  />

                  {/* Live Camera Feed if Camera AR is active */}
                  {arCameraActive && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      disablePictureInPicture
                      disableRemotePlayback
                      controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                      className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                    />
                  )}

                  {/* Loading Indicator for 3D model */}
                  {isModelLoading && (studioTab === "3d" || arCameraActive) && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-warm-ivory/85 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
                      <div className="w-10 h-10 border-2 border-charcoal-ink/20 border-t-charcoal-ink rounded-full animate-spin mb-3" />
                      <p className="font-display text-xs uppercase tracking-widest text-charcoal-ink font-semibold">
                        Loading 3D Model {loadProgress > 0 ? `(${loadProgress}%)` : ""}
                      </p>
                      <p className="font-sans text-[11px] text-stone-500 mt-1">
                        Preparing luxury 3D upholstery...
                      </p>
                    </div>
                  )}

                  {/* 3D Tab Overlays */}
                  {studioTab === "3d" && (
                    <>
                      {hasConfig3D && activeModelUrl ? (
                        <>
                          {/* Controls Hint & Reset View */}
                          <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex items-center justify-between">
                            <span className="bg-white/90 backdrop-blur-sm border border-stainless-silver px-3 py-1 text-[11px] font-sans rounded-sm shadow-sm text-stone-700">
                              Drag to rotate • Scroll to zoom
                            </span>
                            <button
                              type="button"
                              onClick={resetCameraView}
                              className="pointer-events-auto bg-white/90 hover:bg-white backdrop-blur-sm border border-stainless-silver px-2.5 py-1 text-[11px] font-sans font-semibold rounded-sm shadow-sm text-charcoal-ink transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 hover:border-charcoal-ink"
                              title="Reset camera view to center model"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Reset View</span>
                            </button>
                          </div>

                          {/* Active Selection Pill & Quick Model Shift */}
                          <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
                            <div className="bg-white/95 backdrop-blur-sm border border-stainless-silver px-3 py-1.5 rounded-sm shadow-md flex items-center gap-2 pointer-events-auto">
                              <span
                                className="w-3 h-3 rounded-full border border-black/15 shrink-0 shadow-inner"
                                style={{ backgroundColor: selectedFabricObj.hex }}
                              />
                              <span className="text-[11px] font-sans text-charcoal-ink font-semibold">
                                {selectedFabric}
                              </span>
                              <span className="text-stone-300">|</span>
                              <span
                                className="w-3 h-3 rounded-full border border-black/15 shrink-0 shadow-inner"
                                style={{ backgroundColor: selectedSteelObj.hex }}
                              />
                              <span className="text-[11px] font-sans text-stone-700 font-semibold">
                                {selectedSteel} Base
                              </span>
                            </div>

                            {/* Quick Model Shift Pill in 3D */}
                            <div className="bg-white/95 backdrop-blur-sm border border-stainless-silver px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1.5 pointer-events-auto text-[11px] font-sans font-semibold text-charcoal-ink">
                              <button
                                type="button"
                                onClick={() => handleShiftModel("prev")}
                                className="hover:text-stone-500 cursor-pointer p-0.5"
                                title="Previous Model"
                                aria-label="Previous model"
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-[11px] font-bold">{selectedConfig}</span>
                              <button
                                type="button"
                                onClick={() => handleShiftModel("next")}
                                className="hover:text-stone-500 cursor-pointer p-0.5"
                                title="Next Model"
                                aria-label="Next model"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* No 3D Model Notice */
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-50/95 z-20">
                          <div className="w-12 h-12 rounded-full bg-stone-200/70 border border-stone-300 flex items-center justify-center mb-3">
                            <View className="h-5 w-5 text-charcoal-ink" />
                          </div>
                          <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 font-bold mb-1">
                            Configuration 3D View
                          </span>
                          <h4 className="font-display text-base font-bold text-charcoal-ink mb-1.5">
                            No 3D Model for {currentConfig.name} Just For Now
                          </h4>
                          <p className="font-sans text-xs text-stone-600 max-w-sm mb-4 leading-relaxed">
                            The 3D model for this configuration is currently being prepared. You can view the 3-Seater Sofa in full interactive 3D.
                          </p>
                          <button
                            onClick={() => handleSelectConfig("Three Seater")}
                            className="bg-charcoal-ink text-white font-sans text-xs font-semibold py-2 px-4 rounded-sm uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
                          >
                            View Three Seater in 3D
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* 2D Sketch Tab Viewport */}
                  {studioTab === "sketch" && (
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 bg-white/95 backdrop-blur-xs select-none">
                      {/* Top Bar: Title & Dimensions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 z-20">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 bg-stone-100 border border-stainless-silver px-2.5 py-1 rounded-sm text-xs font-sans font-bold text-charcoal-ink shadow-2xs">
                            <Ruler className="h-3.5 w-3.5 text-charcoal-ink" />
                            <span className="uppercase tracking-wider">
                              {currentConfig.schematicTitle || `${selectedConfig} 2D Sketch`}
                            </span>
                          </span>
                        </div>

                        <div className="bg-white/90 border border-stainless-silver px-2.5 py-1 rounded-sm text-[11px] font-sans text-stone-600 shadow-2xs">
                          <span>Overall: <strong className="text-charcoal-ink">{currentConfig.dimensions.overall}</strong></span>
                        </div>
                      </div>

                      {/* Center Sketch Image Display with Left/Right Shift Buttons */}
                      <div className="relative flex-1 w-full flex items-center justify-center min-h-0 my-2 group/sketch">
                        {/* Previous Model Shift Button */}
                        <button
                          type="button"
                          onClick={() => handleShiftModel("prev")}
                          className="absolute left-1 sm:left-3 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white text-charcoal-ink border border-stainless-silver rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 group/btn"
                          title="Shift to Previous Seater Model"
                          aria-label="Previous model"
                        >
                          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover/btn:-translate-x-0.5" />
                        </button>

                        {/* Sketch Graphic */}
                        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                          <img
                            key={activeSketchUrl}
                            src={activeSketchUrl}
                            alt={`${selectedConfig} 2D Sketch`}
                            className="max-h-full max-w-full object-contain object-center drop-shadow-xs transition-opacity duration-300 select-none"
                          />
                        </div>

                        {/* Next Model Shift Button */}
                        <button
                          type="button"
                          onClick={() => handleShiftModel("next")}
                          className="absolute right-1 sm:right-3 z-30 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white text-charcoal-ink border border-stainless-silver rounded-full shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 group/btn"
                          title="Shift to Next Seater Model"
                          aria-label="Next model"
                        >
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      </div>

                      {/* Bottom: Architectural Dimensions */}
                      <div className="w-full flex items-center justify-center z-20">
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-sans text-stone-500 uppercase tracking-wider bg-warm-ivory/60 px-3 py-1.5 rounded-sm border border-stainless-silver/60">
                          <span>Overall: <strong className="text-charcoal-ink">{currentConfig.dimensions.overall}</strong></span>
                          <span>•</span>
                          <span>Seat Depth: <strong className="text-charcoal-ink">{currentConfig.dimensions.seatDepth}</strong></span>
                          <span>•</span>
                          <span>Seat Height: <strong className="text-charcoal-ink">{currentConfig.dimensions.seatHeight}</strong></span>
                          <span>•</span>
                          <span>Base Clearance: <strong className="text-charcoal-ink">{currentConfig.dimensions.clearance}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AR Tab Content */}
                  {studioTab === "ar" && (
                    <div
                      className={`absolute inset-0 z-20 flex flex-col justify-between ${
                        arCameraActive
                          ? "bg-transparent pointer-events-none p-3 sm:p-4"
                          : "items-center justify-center p-6 bg-warm-ivory/95 overflow-y-auto pointer-events-auto"
                      }`}
                    >
                      {arCameraActive ? (
                        <>
                          {/* Top Controls Overlay */}
                          <div className="w-full flex items-center justify-between gap-2 pointer-events-none">
                            <div className="bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 text-xs font-sans rounded-sm shadow-md flex items-center gap-2 pointer-events-auto">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                                style={{ backgroundColor: selectedFabricObj.hex }}
                              />
                              <span className="font-semibold text-[11px]">{selectedFabric}</span>
                              <span className="text-white/40">|</span>
                              <span className="text-white/80 text-[11px]">{selectedSteel}</span>
                            </div>

                            <div className="flex items-center gap-2 pointer-events-auto">
                              <span className="bg-emerald-700/90 backdrop-blur-xs text-white border border-emerald-600 px-3 py-1 text-xs font-sans rounded-sm shadow-md flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                Live Camera AR Active
                              </span>
                              <button
                                onClick={stopCameraAR}
                                className="bg-white/95 hover:bg-white text-charcoal-ink border border-stainless-silver px-3 py-1 text-xs font-sans rounded-sm shadow-md transition-colors cursor-pointer font-semibold active:scale-95"
                              >
                                Exit Camera AR
                              </button>
                            </div>
                          </div>

                          {/* Bottom Controls Overlay */}
                          <div className="w-full flex items-center justify-between gap-2 pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 text-[11px] font-sans rounded-sm shadow-md pointer-events-auto">
                              Drag to rotate & position • Scroll to zoom
                            </span>
                            <button
                              type="button"
                              onClick={resetCameraView}
                              className="pointer-events-auto bg-white/95 hover:bg-white backdrop-blur-sm border border-stainless-silver px-2.5 py-1 text-[11px] font-sans font-semibold rounded-sm shadow-md text-charcoal-ink transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                              title="Reset view"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Reset Model</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="max-w-md w-full flex flex-col items-center text-center animate-fadeIn">
                          <div className="w-11 h-11 rounded-full bg-charcoal-ink text-white flex items-center justify-center mb-2.5">
                            <Scan className="w-5 h-5" />
                          </div>
                          <h4 className="font-display text-base font-bold text-charcoal-ink tracking-tight uppercase mb-1">
                            Augmented Reality View
                          </h4>
                          <p className="font-sans text-xs text-stone-500 mb-4 max-w-sm">
                            Place the {product.name} ({selectedFabric} & {selectedSteel} Base) in your room at true 1:1 scale
                          </p>

                          {isAndroidDevice ? (
                            <div className="w-full space-y-2">
                              <button
                                onClick={handleOpenSceneViewer}
                                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider cursor-pointer"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>Launch Google Scene Viewer (Native AR)</span>
                              </button>
                              <button
                                onClick={startCameraAR}
                                className="w-full py-2.5 px-4 bg-white border border-stainless-silver hover:bg-stone-100 text-charcoal-ink font-sans text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Start In-Browser Camera AR</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-stainless-silver rounded-sm shadow-sm w-full">
                              <div className="relative w-28 h-28 shrink-0 bg-white border border-stone-200 p-1 rounded-sm flex items-center justify-center">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(getArUrl())}`}
                                  alt="AR QR Code"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="flex flex-col text-left space-y-2 flex-1">
                                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-charcoal-ink">
                                  📱 Scan with your smartphone
                                </span>
                                <p className="text-[11px] font-sans text-stone-500 leading-snug">
                                  Open your phone camera to view in native ARCore / Scene Viewer directly on your floor.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <button
                                    onClick={startCameraAR}
                                    className="py-1.5 px-3 bg-charcoal-ink hover:bg-stone-800 text-white text-[11px] font-sans font-semibold rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Live Camera AR</span>
                                  </button>
                                  <button
                                    onClick={handleCopyArLink}
                                    className="py-1.5 px-3 border border-stone-300 hover:bg-stone-50 text-charcoal-ink text-[11px] font-sans font-semibold rounded-sm transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {arCameraError && (
                            <p className="font-sans text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-sm mt-3">
                              ⚠️ {arCameraError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Seater, Fabric and Steel Finish Sections (Unified into One Clean Customizer Section) */}
              <div className="lg:col-span-5 w-full min-w-0">
                <div className="bg-surface border border-stainless-silver rounded-sm shadow-2xs overflow-hidden divide-y divide-stainless-silver w-full min-w-0">
                  {/* Seater Configuration Section */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center pb-2.5 sm:pb-3 border-b border-stainless-silver/60 mb-3">
                      <span className="font-sans text-xs tracking-wider uppercase text-on-surface-variant font-bold">
                        Seater: <strong className="text-charcoal-ink ml-1">{selectedConfig}</strong>
                      </span>
                      <span className="text-[10px] font-sans text-stone-500 uppercase tracking-wider font-semibold">
                        {SOFA_SUBSECTIONS.length} Available
                      </span>
                    </div>

                    {/* Mobile: 2 Lines Only (Line 1: 3 buttons, Line 2: 2 buttons) */}
                    <div className="flex flex-col gap-1.5 lg:hidden">
                      {/* Line 1: Single Seater, Double Seater, Three Seater */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {SOFA_SUBSECTIONS.slice(0, 3).map((sub) => {
                          const isSelected =
                            selectedConfig.toLowerCase() === sub.name.toLowerCase() ||
                            selectedConfig.toLowerCase() === sub.id.toLowerCase();
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectConfig(sub.name)}
                              className={`py-2 px-1 text-[11px] font-sans rounded-sm border transition-all text-center cursor-pointer ${
                                isSelected
                                  ? "bg-charcoal-ink text-white font-bold border-charcoal-ink shadow-xs"
                                  : "bg-white hover:bg-stone-100 text-charcoal-ink border-stainless-silver font-medium"
                              }`}
                            >
                              <span className="block font-semibold truncate">{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Line 2: L-Shaped, U-Shaped */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {SOFA_SUBSECTIONS.slice(3, 5).map((sub) => {
                          const isSelected =
                            selectedConfig.toLowerCase() === sub.name.toLowerCase() ||
                            selectedConfig.toLowerCase() === sub.id.toLowerCase();
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectConfig(sub.name)}
                              className={`py-2 px-1 text-[11px] font-sans rounded-sm border transition-all text-center cursor-pointer ${
                                isSelected
                                  ? "bg-charcoal-ink text-white font-bold border-charcoal-ink shadow-xs"
                                  : "bg-white hover:bg-stone-100 text-charcoal-ink border-stainless-silver font-medium"
                              }`}
                            >
                              <span className="block font-semibold truncate">{sub.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Desktop: Standard Grid */}
                    <div className="hidden lg:grid grid-cols-3 gap-2">
                      {SOFA_SUBSECTIONS.map((sub) => {
                        const isSelected =
                          selectedConfig.toLowerCase() === sub.name.toLowerCase() ||
                          selectedConfig.toLowerCase() === sub.id.toLowerCase();
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelectConfig(sub.name)}
                            className={`py-2 px-2.5 text-xs font-sans rounded-sm border transition-all text-center cursor-pointer ${
                              isSelected
                                ? "bg-charcoal-ink text-white font-bold border-charcoal-ink shadow-xs"
                                : "bg-white hover:bg-stone-100 text-charcoal-ink border-stainless-silver font-medium"
                            }`}
                          >
                            <span className="block font-semibold">{sub.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fabric Swatch Section */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center pb-2.5 sm:pb-3 border-b border-stainless-silver/60 mb-3">
                      <span className="font-sans text-xs tracking-wider uppercase text-on-surface-variant font-bold">
                        Fabric: <strong className="text-charcoal-ink ml-1">{selectedFabric}</strong>
                      </span>
                      <span className="text-[10px] font-sans text-stone-500 uppercase tracking-wider font-semibold">
                        {FABRIC_SWATCHES.length} Options
                      </span>
                    </div>

                    {/* Mobile: 5 swatches in a row, right scrollable */}
                    <div className="flex lg:hidden overflow-x-auto gap-1.5 pb-2 scrollbar-thin snap-x snap-mandatory">
                      {FABRIC_SWATCHES.map((fab) => {
                        const isSelected = selectedFabric === fab.name;
                        return (
                          <button
                            key={fab.name}
                            type="button"
                            onClick={() => {
                              setSelectedFabric(fab.name);
                              const idx = displayImages.indexOf(fab.image);
                              if (idx !== -1) setActiveImageIdx(idx);
                            }}
                            className={`w-[calc((100%-24px)/5)] shrink-0 snap-start group relative text-left border rounded-sm overflow-hidden bg-white hover:border-charcoal-ink transition-all cursor-pointer ${
                              isSelected ? "border-charcoal-ink shadow-sm ring-1 ring-charcoal-ink" : "border-stainless-silver"
                            }`}
                          >
                            <div className="relative aspect-square w-full bg-stone-100">
                              <img
                                src={fab.image}
                                alt={fab.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Checkbox Overlay in bottom-left */}
                              <div className="absolute bottom-1 left-1 z-10 flex items-center justify-center">
                                {isSelected ? (
                                  <div className="w-3 h-3 bg-charcoal-ink border border-white text-white flex items-center justify-center rounded-sm shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2 h-2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-3 h-3 border border-white bg-black/25 rounded-sm" />
                                )}
                              </div>
                            </div>
                            <div className="p-1 border-t border-stone-100">
                              <p className="font-sans text-[7.5px] xs:text-[8px] uppercase font-bold text-charcoal-ink truncate leading-tight text-center">
                                {fab.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Desktop: 6 cols grid */}
                    <div className="hidden lg:grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                      {FABRIC_SWATCHES.map((fab) => {
                        const isSelected = selectedFabric === fab.name;
                        return (
                          <button
                            key={fab.name}
                            type="button"
                            onClick={() => {
                              setSelectedFabric(fab.name);
                              const idx = displayImages.indexOf(fab.image);
                              if (idx !== -1) setActiveImageIdx(idx);
                            }}
                            className={`group relative text-left border rounded-sm overflow-hidden bg-white hover:border-charcoal-ink transition-all cursor-pointer ${
                              isSelected ? "border-charcoal-ink shadow-sm ring-1 ring-charcoal-ink" : "border-stainless-silver"
                            }`}
                          >
                            <div className="relative aspect-square w-full bg-stone-100">
                              <img
                                src={fab.image}
                                alt={fab.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Checkbox Overlay in bottom-left */}
                              <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center justify-center">
                                {isSelected ? (
                                  <div className="w-4 h-4 bg-charcoal-ink border border-white text-white flex items-center justify-center rounded-sm shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 border border-white bg-black/25 rounded-sm" />
                                )}
                              </div>
                            </div>
                            <div className="p-1.5 sm:p-2 border-t border-stone-100">
                              <p className="font-sans text-[9px] sm:text-[10px] uppercase font-bold text-charcoal-ink truncate leading-tight text-center sm:text-left">
                                {fab.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Steel / Base Finish Section */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center pb-2.5 sm:pb-3 border-b border-stainless-silver/60 mb-3">
                      <span className="font-sans text-xs tracking-wider uppercase text-on-surface-variant font-bold">
                        Steel / Base Finish: <strong className="text-charcoal-ink ml-1">{selectedSteel}</strong>
                      </span>
                      <span className="text-[10px] font-sans text-stone-500 uppercase tracking-wider font-semibold">
                        {STEEL_FINISHES.length} Options
                      </span>
                    </div>

                    {/* Mobile: 5 swatches in a row, right scrollable */}
                    <div className="flex lg:hidden overflow-x-auto gap-1.5 pb-2 scrollbar-thin snap-x snap-mandatory">
                      {STEEL_FINISHES.map((st) => {
                        const isSelected = selectedSteel === st.name;
                        return (
                          <button
                            key={st.name}
                            type="button"
                            onClick={() => {
                              setSelectedSteel(st.name);
                              const idx = displayImages.indexOf(st.image);
                              if (idx !== -1) setActiveImageIdx(idx);
                            }}
                            className={`w-[calc((100%-24px)/5)] shrink-0 snap-start group relative text-left border rounded-sm overflow-hidden bg-white hover:border-charcoal-ink transition-all cursor-pointer ${
                              isSelected ? "border-charcoal-ink shadow-sm ring-1 ring-charcoal-ink" : "border-stainless-silver"
                            }`}
                          >
                            <div className="relative aspect-square w-full bg-stone-100">
                              <img
                                src={st.image}
                                alt={st.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Checkbox Overlay in bottom-left */}
                              <div className="absolute bottom-1 left-1 z-10 flex items-center justify-center">
                                {isSelected ? (
                                  <div className="w-3 h-3 bg-charcoal-ink border border-white text-white flex items-center justify-center rounded-sm shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-3 h-3 border border-white bg-black/25 rounded-sm" />
                                )}
                              </div>
                            </div>
                            <div className="p-1 border-t border-stone-100 text-center">
                              <p className="font-sans text-[7.5px] xs:text-[8px] uppercase font-bold text-charcoal-ink truncate leading-tight">
                                {st.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Desktop: Grid cols */}
                    <div className="hidden lg:grid grid-cols-4 gap-2.5">
                      {STEEL_FINISHES.map((st) => {
                        const isSelected = selectedSteel === st.name;
                        return (
                          <button
                            key={st.name}
                            type="button"
                            onClick={() => {
                              setSelectedSteel(st.name);
                              const idx = displayImages.indexOf(st.image);
                              if (idx !== -1) setActiveImageIdx(idx);
                            }}
                            className={`group relative text-left border rounded-sm overflow-hidden bg-white hover:border-charcoal-ink transition-all cursor-pointer ${
                              isSelected ? "border-charcoal-ink shadow-sm ring-1 ring-charcoal-ink" : "border-stainless-silver"
                            }`}
                          >
                            <div className="relative aspect-square w-full bg-stone-100">
                              <img
                                src={st.image}
                                alt={st.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              
                              {/* Checkbox Overlay in bottom-left */}
                              <div className="absolute bottom-1.5 left-1.5 z-10 flex items-center justify-center">
                                {isSelected ? (
                                  <div className="w-4 h-4 bg-charcoal-ink border border-white text-white flex items-center justify-center rounded-sm shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 border border-white bg-black/25 rounded-sm" />
                                )}
                              </div>
                            </div>
                            <div className="p-1.5 sm:p-2 border-t border-stone-100 text-center">
                              <p className="font-sans text-[9px] sm:text-[10px] uppercase font-bold text-charcoal-ink truncate leading-tight">
                                {st.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Product Details & Materials (Positioned after Interactive 3D & AR Studio on mobile) */}
        <div className="block lg:hidden mt-8 pt-6 border-t border-stainless-silver bg-surface p-4 rounded-sm">
          <h3 className="font-display text-xs uppercase tracking-widest font-bold text-charcoal-ink mb-3">
            Product Details & Materials
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-on-surface-variant font-sans text-xs leading-relaxed">
            {product.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
            <li>Anti-termite treated wood core</li>
            <li>Double stitch tailoring seams</li>
          </ul>
        </div>

        {/* Mobile: Similar Choices (Right Scrollable, Positioned right next to Customer Gallery & Reviews on mobile) */}
        <section className="block lg:hidden mt-8 pt-6 border-t border-stainless-silver">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-display text-xs sm:text-sm font-bold text-charcoal-ink uppercase tracking-wider">
              Similar Choices
            </h2>
            <span className="text-[10px] font-sans text-stone-400 uppercase tracking-wider font-semibold">
              Swipe →
            </span>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-thin snap-x snap-mandatory px-1">
            {similarProducts.map((p) => (
              <div
                key={p.id}
                className="w-[150px] xs:w-[165px] shrink-0 snap-start group cursor-pointer border border-stainless-silver p-2.5 rounded-sm bg-surface flex flex-col justify-between shadow-2xs hover:border-charcoal-ink transition-colors"
              >
                <Link href={`/products/${p.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-warm-ivory/30 mb-2 border border-stainless-silver/60 rounded-xs">
                    <Image
                      src={p.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="165px"
                    />
                  </div>
                  <h3 className="font-sans font-bold text-charcoal-ink text-xs uppercase tracking-wider truncate mb-1">
                    {p.name}
                  </h3>
                  <span className="text-[10px] font-sans font-semibold text-stone-500 uppercase tracking-wider block">
                    View Details →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Gallery & Reviews Section (Displayed next to Similar Choices on mobile) */}
        <section className="mt-8 lg:mt-20 border-t border-stainless-silver pt-6 lg:pt-16 w-full min-w-0 overflow-hidden">
          {(() => {
            const allReviews = localReviews.map(r => ({
              id: r.id,
              rating: r.rating,
              reviewerName: r.reviewerName,
              location: "Verified Patron",
              title: `Feedback on ${product.name}`,
              opinion: r.opinion
            }));

            const averageVal = allReviews.length > 0
              ? parseFloat((allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length).toFixed(1))
              : 0;

            return (
              <div className="w-full min-w-0">
                <h2 className="font-display text-base sm:text-xl font-bold text-charcoal-ink mb-6 sm:mb-10 uppercase tracking-wider text-center">Customer Gallery & Reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start w-full min-w-0">
                  {/* Review Summary */}
                  <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
                    <div className="bg-surface p-4 sm:p-6 border border-stainless-silver rounded-sm text-center w-full min-w-0 shadow-2xs sm:shadow-none">
                      <div className="text-4xl sm:text-5xl font-display font-bold text-charcoal-ink mb-2">{averageVal > 0 ? averageVal.toFixed(1) : "—"}</div>
                      <div className="flex justify-center gap-1 text-charcoal-ink mb-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const isGold = averageVal > 0 && i < Math.round(averageVal);
                          return (
                            <Star
                              key={i}
                              className={`h-4 sm:h-5 w-4 sm:w-5 ${isGold ? "fill-charcoal-ink text-charcoal-ink" : "text-stone-300"}`}
                            />
                          );
                        })}
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant">
                        {allReviews.length > 0 ? `Based on ${allReviews.length} customer review${allReviews.length > 1 ? 's' : ''}` : "No customer reviews yet"}
                      </p>
                    </div>
                    <Link
                      href="/reviews"
                      className="w-full text-center block bg-transparent border border-charcoal-ink text-charcoal-ink font-sans text-label-caps py-3 hover:bg-charcoal-ink hover:text-white transition-all text-xs tracking-wider rounded-sm uppercase font-semibold"
                    >
                      Write a Review
                    </Link>
                  </div>

                  {/* Reviews Bento Grid */}
                  <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
                    {allReviews.map((r) => (
                      <div key={r.id} className="bg-surface p-4 sm:p-6 border border-stainless-silver rounded-sm flex flex-col gap-3 sm:gap-4 w-full min-w-0 shadow-2xs sm:shadow-none">
                        <div className="flex gap-0.5 text-charcoal-ink">
                          {Array.from({ length: 5 }).map((_, idx) => {
                            const isGold = idx < r.rating;
                            return (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${isGold ? "fill-charcoal-ink text-charcoal-ink" : "text-stone-300"}`}
                              />
                            );
                          })}
                        </div>
                        <h4 className="font-sans font-bold text-charcoal-ink text-sm sm:text-base">{r.title}</h4>
                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                          {r.opinion}
                        </p>
                        <span className="font-sans text-[10px] text-stone-400 mt-auto pt-2 sm:pt-4">— {r.reviewerName}, {r.location}</span>
                      </div>
                    ))}
                    {allReviews.length === 0 && (
                      <div className="md:col-span-2 text-center py-8 sm:py-12 border border-dashed border-stone-200 rounded-sm bg-white flex flex-col items-center justify-center min-h-[140px] sm:min-h-[200px] w-full min-w-0">
                        <p className="text-xs text-stone-400 font-sans tracking-wide uppercase">No verified patron feedback posted yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Similar Choices Section (Desktop view) */}
        <section className="hidden lg:block mt-10 sm:mt-20 border-t border-stainless-silver pt-8 sm:pt-16 px-2 sm:px-0">
          <h2 className="font-display text-base sm:text-xl font-bold text-charcoal-ink mb-4 sm:mb-10 uppercase tracking-wider text-center">Similar Choices</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-gutter">
            {similarProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer border border-stainless-silver p-2 sm:p-4 rounded-lg sm:rounded-sm bg-surface flex flex-col justify-between shadow-2xs sm:shadow-none hover:border-charcoal-ink transition-colors">
                <Link href={`/products/${p.id}`}>
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-surface mb-2 sm:mb-4 border border-stainless-silver/60 rounded-sm">
                    <Image
                      src={p.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-sans font-bold text-charcoal-ink text-xs sm:text-sm uppercase tracking-wider truncate sm:whitespace-normal mb-0.5 sm:mb-1">{p.name}</h3>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </div>

    {/* AR View Modal */}
    {showAR && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-sm border border-charcoal-ink/20 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
          {/* Modal Header */}
          <div className="bg-warm-ivory border-b border-stainless-silver px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-charcoal-ink text-white flex items-center justify-center">
                <Scan className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-charcoal-ink tracking-tight uppercase">
                  Augmented Reality (AR) View
                </h3>
                <p className="font-sans text-[11px] text-stone-500">
                  Preview Stallion Stainless furniture in your space at 1:1 true scale
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAR(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-charcoal-ink transition-colors cursor-pointer"
              aria-label="Close AR Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Configuration Notice if not 3-seater */}
            {!hasConfig3D && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-sm text-amber-900 text-xs font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold">AR 3D Model Optimization</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    The AR 3D model is currently available for the 3-Seater Sofa.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedConfig("3-Seater Sofa");
                  }}
                  className="bg-charcoal-ink text-white px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
                >
                  Switch to 3-Seater
                </button>
              </div>
            )}

            {/* Active Selection summary banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50 border border-stone-200 p-3 rounded-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0"
                  style={{ backgroundColor: selectedFabricObj.hex }}
                />
                <span className="text-xs font-sans text-charcoal-ink font-semibold">
                  {selectedFabric}
                </span>
                <span className="text-stone-300">|</span>
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shadow-inner shrink-0"
                  style={{ backgroundColor: selectedSteelObj.hex }}
                />
                <span className="text-xs font-sans text-charcoal-ink font-semibold">
                  {selectedSteel} Base
                </span>
              </div>
              <span className="text-[11px] font-sans text-stone-500 font-medium">
                Size: 84&quot;W x 38&quot;D x 36&quot;H
              </span>
            </div>

            {/* Native Android AR Banner when viewed on Android phone */}
            {isAndroidDevice && (
              <div className="bg-emerald-50 border border-emerald-300/80 rounded-sm p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-emerald-950 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Android AR Ready</span>
                </div>
                <p className="text-xs text-emerald-800/90 mb-3 max-w-sm mx-auto">
                  Place the AURA 3-Seater Sofa directly onto your floor in true 1:1 scale using Google Scene Viewer.
                </p>
                <button
                  onClick={handleOpenSceneViewer}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-sans text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Launch Google Scene Viewer (Native AR)</span>
                </button>
              </div>
            )}

            {/* Two Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Mobile Camera Scan */}
              <div className="border border-stainless-silver rounded-sm p-4 bg-warm-ivory/50 flex flex-col items-center text-center justify-between">
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-ink mb-1.5">
                    <Smartphone className="w-4 h-4 text-charcoal-ink" />
                    <span>Scan With Phone</span>
                  </div>
                  <p className="text-[11px] font-sans text-stone-500 mb-3">
                    Point iPhone or Android camera to place sofa on your room floor
                  </p>

                  {/* QR Code */}
                  <div className="relative w-36 h-36 bg-white border border-stone-300 rounded-sm p-2 shadow-sm mb-3 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(getArUrl())}`}
                      alt="AR QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <button
                    onClick={handleCopyArLink}
                    className="w-full py-2 px-3 border border-charcoal-ink/30 bg-white hover:bg-stone-50 text-charcoal-ink text-xs font-sans font-semibold rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied AR Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                        <span>Copy Mobile AR Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleOpenSceneViewer}
                    className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-sans font-medium rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-stone-600" />
                    <span>Android Scene Viewer</span>
                  </button>
                </div>
              </div>

              {/* Option 2: Live Camera AR Mode */}
              <div className="border border-stainless-silver rounded-sm p-4 bg-warm-ivory/50 flex flex-col items-center text-center justify-between">
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase tracking-wider text-charcoal-ink mb-1.5">
                    <Camera className="w-4 h-4 text-charcoal-ink" />
                    <span>Live Camera AR</span>
                  </div>
                  <p className="text-[11px] font-sans text-stone-500 mb-4">
                    Stream your device&apos;s camera feed directly behind the 3D model in this browser window
                  </p>

                  <div className="w-24 h-24 rounded-full bg-charcoal-ink/5 border border-charcoal-ink/15 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-charcoal-ink/70" />
                  </div>

                  <p className="text-[11px] font-sans text-stone-600 leading-relaxed mb-4">
                    Works on mobile browsers, tablets, and laptops. Allows real-time positioning and color switching.
                  </p>
                </div>

                <div className="w-full">
                  {arCameraError && (
                    <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 p-2 rounded-sm mb-2 text-left">
                      {arCameraError}
                    </p>
                  )}

                  <button
                    onClick={startCameraAR}
                    className="w-full py-3 px-4 bg-charcoal-ink hover:bg-stone-800 text-white text-xs font-sans font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer uppercase tracking-wider"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <span>Start Live Camera AR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t border-stone-200/80 pt-3 text-left">
              <h4 className="font-display text-[11px] uppercase font-bold tracking-wider text-charcoal-ink mb-1.5">
                How AR Room Placement Works:
              </h4>
              <ol className="list-decimal pl-5 text-xs text-stone-600 space-y-1 font-sans">
                <li>Point your camera towards an open floor area with good ambient room lighting.</li>
                <li>Drag or pinch on screen to adjust position and angle.</li>
                <li>Switch fabrics and finishes live to see which best complements your space.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
